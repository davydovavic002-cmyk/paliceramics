#!/usr/bin/env bash
# Run on VPS as deploy user after: git clone ... && cd paliceramics
set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
SITE_URL="${SITE_URL:-https://pali.neostudio.space}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"

cd "$APP_DIR"

if [[ ! -f package.json ]]; then
  echo "Run from project root (package.json not found)."
  exit 1
fi

if [[ -z "$POSTGRES_PASSWORD" ]]; then
  echo "Set POSTGRES_PASSWORD before running, e.g.:"
  echo "  export POSTGRES_PASSWORD='your-strong-password'"
  exit 1
fi

if [[ ! -f .env.local ]]; then
  SESSION_SECRET="$(openssl rand -base64 32)"
  cat > .env.local <<EOF
NODE_ENV=production
DATABASE_URL="postgresql://pali:${POSTGRES_PASSWORD}@localhost:5432/pali_ceramics?schema=public"
SESSION_SECRET="${SESSION_SECRET}"
ADMIN_INITIAL_PASSWORD="${ADMIN_INITIAL_PASSWORD:-ChangeMeNow123!}"
NEXT_PUBLIC_SITE_URL="${SITE_URL}"
NEXT_PUBLIC_USE_INBOX_API="true"
EOF
  echo "Created .env.local — edit ADMIN_INITIAL_PASSWORD if needed."
fi

# Sync postgres password in docker-compose (simple sed)
if grep -q 'POSTGRES_PASSWORD: pali_dev' docker-compose.yml 2>/dev/null; then
  sed -i "s/POSTGRES_PASSWORD: pali_dev/POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}/" docker-compose.yml
fi

echo "Starting PostgreSQL..."
docker compose up -d
sleep 3

echo "Installing dependencies..."
npm install

echo "Database schema + seed..."
npx prisma generate
npx prisma db push
npm run db:seed

echo "Building Next.js..."
npm run build

echo "PM2..."
if pm2 describe pali >/dev/null 2>&1; then
  pm2 restart pali
else
  pm2 start npm --name pali -- start
fi
pm2 save

echo "Done. App on http://127.0.0.1:3556"
echo "Configure nginx + certbot for ${SITE_URL}"
