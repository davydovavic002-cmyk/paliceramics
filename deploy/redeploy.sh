#!/usr/bin/env bash
# Full production redeploy — run on VPS from project root (~/pali).
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

if [[ -f docker-compose.yml ]] && command -v docker >/dev/null 2>&1; then
  echo "==> PostgreSQL (docker compose)"
  docker compose up -d
  sleep 2
fi

if [[ -f .env.local ]] && grep -q DATABASE_URL .env.local 2>/dev/null; then
  echo "==> Database schema"
  npx prisma generate
  npx prisma db push
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
