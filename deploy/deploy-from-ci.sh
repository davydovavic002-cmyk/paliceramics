#!/usr/bin/env bash
# Deploy on a small VPS: pull code, install deps, download CI-built .next (no local next build).
set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "$0")/.." && pwd)}"
REPO="${GITHUB_REPO:-davydovavic002-cmyk/paliceramics}"
WORKFLOW_FILE="${GITHUB_WORKFLOW:-build-next.yml}"
ARTIFACT_NAME="${ARTIFACT_NAME:-next-build}"

cd "$APP_DIR"

if [[ ! -f package.json ]]; then
  echo "Run from project root (package.json not found)."
  exit 1
fi

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "Set GITHUB_TOKEN — fine-grained PAT or classic token with repo + actions:read."
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Install jq: sudo apt install -y jq"
  exit 1
fi

if [[ ! -f .env.local ]]; then
  echo "==> Creating .env.local"
  SESSION_SECRET="$(openssl rand -base64 32 2>/dev/null || echo 'change-me-min-32-characters-long')"
  cat > .env.local <<EOF
NODE_ENV=production
NEXT_PUBLIC_SITE_URL="${SITE_URL:-https://pali.neostudio.space}"
NEXT_PUBLIC_USE_INBOX_API="false"
SESSION_SECRET="${SESSION_SECRET}"
EOF
fi

echo "==> Git pull"
git pull origin main

echo "==> Dependencies (no build on VPS)"
npm install --prefer-offline --no-audit --no-fund

echo "==> Download latest successful CI build"
RUN_ID="$(
  curl -fsSL -H "Authorization: Bearer ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/runs?status=success&per_page=1" \
    | jq -r '.workflow_runs[0].id // empty'
)"

if [[ -z "$RUN_ID" || "$RUN_ID" == "null" ]]; then
  echo "No successful CI run found. Push to main or run workflow on GitHub first."
  exit 1
fi

ARTIFACT_ID="$(
  curl -fsSL -H "Authorization: Bearer ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/${REPO}/actions/runs/${RUN_ID}/artifacts" \
    | jq -r --arg name "$ARTIFACT_NAME" '.artifacts[] | select(.name == $name) | .id' | head -1
)"

if [[ -z "$ARTIFACT_ID" || "$ARTIFACT_ID" == "null" ]]; then
  echo "Artifact '${ARTIFACT_NAME}' not found on run ${RUN_ID}."
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

curl -fsSL -H "Authorization: Bearer ${GITHUB_TOKEN}" -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${REPO}/actions/artifacts/${ARTIFACT_ID}/zip" \
  -o "${TMP_DIR}/artifact.zip"

unzip -q "${TMP_DIR}/artifact.zip" -d "${TMP_DIR}/artifact"

echo "==> Install .next from CI"
pm2 stop pali 2>/dev/null || true
rm -rf .next
tar -xzf "${TMP_DIR}/artifact/next-build.tar.gz" -C "$APP_DIR"

if [[ ! -f .next/BUILD_ID ]]; then
  echo "Invalid artifact — .next/BUILD_ID missing."
  exit 1
fi

echo "==> PM2"
if pm2 describe pali >/dev/null 2>&1; then
  pm2 restart pali
else
  pm2 start npm --name pali -- start
fi
pm2 save

echo ""
echo "Done — deployed .next from CI run ${RUN_ID}."
echo "  BUILD_ID: $(cat .next/BUILD_ID)"
echo "  curl -I http://127.0.0.1:3556/shop"
