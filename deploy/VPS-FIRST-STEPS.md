# VPS — что сделать в первую очередь

> Домен: **paliceramics.com**  
> Стек: Next.js 15 + PostgreSQL (Docker) + Nginx + PM2  
> Обновлено: август 2026

Локально Docker **не обязателен** — на своём компьютере можно продолжать в demo-режиме (`localStorage`).  
**На сервере** Docker нужен для PostgreSQL — без него заявки, коды ваучеров и inbox не сохраняются в БД.

---

## Порядок действий (чеклист)

### 1. VPS и доступ

- [ ] Арендовать VPS (EU/PL, от 2 GB RAM, 1 vCPU)
- [ ] Ubuntu 22.04 или 24.04
- [ ] SSH-доступ: `ssh root@YOUR_VPS_IP`
- [ ] Обновить систему:
  ```bash
  apt update && apt upgrade -y
  ```

### 2. Базовый софт

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx

# PM2 (автозапуск приложения)
npm install -g pm2

# Docker (только для PostgreSQL)
apt install -y docker.io docker-compose-plugin
systemctl enable docker
systemctl start docker
```

### 3. Домен

- [ ] Купить **paliceramics.com**
- [ ] DNS A-запись `@` → IP VPS
- [ ] DNS A-запись `www` → IP VPS

Проверка (через несколько минут):

```bash
dig paliceramics.com +short
```

### 4. Клонировать проект

```bash
mkdir -p /var/www
cd /var/www
git clone YOUR_REPO_URL pali
cd pali
npm install
```

### 5. PostgreSQL через Docker

В корне проекта уже есть `docker-compose.yml`.

```bash
cd /var/www/pali
docker compose up -d
docker compose ps   # postgres должен быть Up
```

### 6. Переменные окружения

```bash
cp .env.example .env.local
nano .env.local
```

**Обязательно изменить:**

```env
DATABASE_URL="postgresql://pali:pali_dev@localhost:5432/pali_ceramics?schema=public"
SESSION_SECRET="СЛУЧАЙНАЯ_ДЛИННАЯ_СТРОКА_32+_СИМВОЛОВ"
ADMIN_INITIAL_PASSWORD="НОВЫЙ_ПАРОЛЬ_ДЛЯ_ПАЛИНЫ"
NEXT_PUBLIC_SITE_URL="https://paliceramics.com"
NEXT_PUBLIC_USE_INBOX_API="true"
```

> **Важно:** в production смените пароль Postgres в `docker-compose.yml` и тот же пароль пропишите в `DATABASE_URL`.

Resend / email студии **не нужны** — заявки только в админке, пользователи пишут сами через мессенджер.

### 7. База данных — миграция и seed

```bash
npm run db:migrate
npm run db:seed
```

- `db:migrate` — создаёт таблицы
- `db:seed` — начальные товары, слоты, admin-пользователь (пароль из `ADMIN_INITIAL_PASSWORD`)

Проверка входа: https://paliceramics.com/admin (после деплоя).

### 8. Сборка и запуск

```bash
npm run build
pm2 start npm --name pali -- start
pm2 save
pm2 startup   # выполнить команду, которую выведет pm2
```

Приложение слушает порт **3556**.

### 9. Nginx + HTTPS

```bash
nano /etc/nginx/sites-available/paliceramics.com
```

```nginx
server {
    listen 80;
    server_name paliceramics.com www.paliceramics.com;

    location / {
        proxy_pass http://127.0.0.1:3556;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/paliceramics.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
apt install -y certbot python3-certbot-nginx
certbot --nginx -d paliceramics.com -d www.paliceramics.com
```

### 10. Проверка после деплоя

| Что проверить | Ожидание |
|---------------|----------|
| Главная | https://paliceramics.com |
| Админка `/admin` | Вход паролем из seed (не `pali` в prod!) |
| Voucher form | После submit — код `PALI-XXXX-2026`, PNG скачивается |
| Booking | Слот −1 место, заявка в Inbox админки |
| Waitlist | Заявка в Inbox + кнопка email |

---

## Обновление сайта (после первого деплоя)

```bash
cd /var/www/pali
git pull
npm install
npm run build
pm2 restart pali
```

Если изменилась схема БД:

```bash
npm run db:migrate
```

---

## Бэкап PostgreSQL (раз в неделю)

```bash
docker exec pali-postgres-1 pg_dump -U pali pali_ceramics > backup-$(date +%F).sql
```

(имя контейнера смотри: `docker compose ps`)

---

## Что пока НЕ на сервере (следующие фазы)

- Загрузка фото в админке (файлы на VPS)
- Автобэкап по cron
- Смена пароля Палины через UI (API `/api/admin/password` уже есть)

---

## Локально vs сервер

| | Локально (без Docker) | VPS (с Docker) |
|---|----------------------|----------------|
| Каталог, тексты | localStorage demo | PostgreSQL |
| Inbox, коды ваучеров | localStorage | PostgreSQL |
| Блокировка слотов | нет | да |
| Auth админки | demo-пароль в клиенте | серверная сессия |

**Ответ на вопрос:** да, Docker запускаешь **на сервере**, не обязательно на своём ПК. Локально можно работать без него до деплоя.
