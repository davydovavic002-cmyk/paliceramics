#!/usr/bin/env bash
# Deploy site to PM2 — no Postgres required (demo mode, admin data in browser localStorage).
set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
SITE_URL="${SITE_URL:-https://pali.neostudio.space}"

cd "$APP_DIR"

if [[ ! -f package.json ]]; then
  echo "Run from project root (package.json not found)."
  exit 1
fi

if [[ ! -f .env.local ]]; then
  echo "==> Creating .env.local (demo mode, no database)"
  SESSION_SECRET="$(openssl rand -base64 32 2>/dev/null || echo 'change-me-min-32-characters-long')"
  cat > .env.local <<EOF
NODE_ENV=production
NEXT_PUBLIC_SITE_URL="${SITE_URL}"
NEXT_PUBLIC_USE_INBOX_API="false"
SESSION_SECRET="${SESSION_SECRET}"
EOF
fi

echo "==> Git pull"
git pull origin main

echo "==> Dependencies"
npm install

echo "==> Build"
npm run build

echo "==> PM2"
if pm2 describe pali >/dev/null 2>&1; then
  pm2 restart pali
else
  pm2 start npm --name pali -- start
fi
pm2 save

if command -v nginx >/dev/null 2>&1 && [[ -f /etc/nginx/sites-enabled/pali.neostudio.space ]]; then
  echo "==> Nginx reload"
  sudo nginx -t && sudo systemctl reload nginx
fi

echo ""
echo "Done — site on PM2 (no Postgres)."
echo "  Local:  curl -I http://127.0.0.1:3556"
echo "  Public: ${SITE_URL}"
echo "  Admin:  ${SITE_URL}/admin  (password: pali, data in browser localStorage)"
echo "  Logs:   pm2 logs pali --lines 50"
