#!/usr/bin/env bash
# Full redeploy with optional Postgres (only when docker + DATABASE_URL are ready).
set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
SITE_URL="${SITE_URL:-https://pali.neostudio.space}"

cd "$APP_DIR"

if [[ ! -f package.json ]]; then
  echo "Run from project root (package.json not found)."
  exit 1
fi

echo "==> Git pull"
git pull origin main

echo "==> Dependencies"
npm install

USE_DB=false
if [[ -f .env.local ]] && grep -q '^DATABASE_URL=' .env.local 2>/dev/null; then
  if grep -q 'NEXT_PUBLIC_USE_INBOX_API="true"' .env.local 2>/dev/null || \
     grep -q "NEXT_PUBLIC_USE_INBOX_API='true'" .env.local 2>/dev/null || \
     grep -q 'NEXT_PUBLIC_USE_INBOX_API=true' .env.local 2>/dev/null; then
    USE_DB=true
  fi
fi

if [[ "$USE_DB" == true ]] && [[ -f docker-compose.yml ]] && command -v docker >/dev/null 2>&1; then
  echo "==> PostgreSQL (docker compose)"
  docker compose up -d
  sleep 3
  if command -v nc >/dev/null 2>&1 && nc -z localhost 5432 2>/dev/null; then
    echo "==> Database schema"
    npm run db:push
    npm run db:seed || true
  else
    echo "WARNING: Postgres not reachable on :5432 — skipping db push. Site runs without server inbox."
  fi
else
  echo "==> Skipping database (demo mode or NEXT_PUBLIC_USE_INBOX_API=false)"
fi

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
echo "Done."
echo "  Local:  curl -I http://127.0.0.1:3556"
echo "  Public: ${SITE_URL}"
echo "  Logs:   pm2 logs pali --lines 50"
