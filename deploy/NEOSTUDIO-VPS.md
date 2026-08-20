# VPS — pali.neostudio.space

> Сервер: `deploy@45.91.169.30`  
> Репо: https://github.com/davydovavic002-cmyk/paliceramics  
> Стек: Next.js 15 + PM2 + Nginx (Docker/Postgres — опционально позже)

---

## 1. DNS

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `pali` | `45.91.169.30` |

---

## 2. Софт (один раз)

```bash
ssh deploy@45.91.169.30

sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx
sudo npm install -g pm2
```

Docker **не нужен** для demo-деплоя.

---

## 3. Деплой (репо уже на сервере)

```bash
cd /path/to/paliceramics   # твоя папка с git
git pull origin main
npm install
```

`.env.local` (если ещё нет):

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL="https://pali.neostudio.space"
NEXT_PUBLIC_USE_INBOX_API="false"
```

```bash
npm run build
pm2 start npm --name pali -- start   # первый раз
# pm2 restart pali                     # следующие разы
pm2 save
pm2 startup   # выполни команду из вывода
```

Проверка:

```bash
curl -I http://127.0.0.1:3556
pm2 status
```

**Demo без Postgres:** админка `/admin`, пароль `pali`. Данные в localStorage браузера.

---

## 4. Nginx + HTTPS

```bash
sudo cp deploy/nginx-pali.neostudio.space.conf /etc/nginx/sites-available/pali.neostudio.space
sudo ln -sf /etc/nginx/sites-available/pali.neostudio.space /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pali.neostudio.space
```

---

## 5. Обновление

```bash
cd /path/to/paliceramics
git pull origin main
npm install
npm run build
pm2 restart pali
```

---

## 6. Другой сервер / другой домен

Те же шаги: `git pull` → `.env.local` с новым URL → `build` → `pm2` → nginx → certbot.  
Ничего не «переписывается» — просто повторяешь на новом VPS.

---

## 7. Postgres позже (когда понадобится inbox на сервере)

```bash
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker deploy   # relogin

docker compose up -d
# .env.local: DATABASE_URL, SESSION_SECRET, NEXT_PUBLIC_USE_INBOX_API=true
npx prisma db push && npm run db:seed
npm run build && pm2 restart pali
```

Шаблон env: `deploy/env.example`
