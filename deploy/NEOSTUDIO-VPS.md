# VPS — pali.neostudio.space

> Сервер: `deploy@45.91.169.30`  
> Репо: https://github.com/davydovavic002-cmyk/paliceramics  
> Стек: Next.js 15 + PostgreSQL (Docker) + Nginx + PM2

---

## 1. DNS

В панели neostudio.space:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | `pali` | `45.91.169.30` |

Проверка (с ПК или сервера):

```bash
dig pali.neostudio.space +short
# должно быть 45.91.169.30
```

---

## 2. Первый раз на сервере (если софт ещё не стоит)

Подключись:

```bash
ssh deploy@45.91.169.30
```

Установка (нужен `sudo`):

```bash
sudo apt update && sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx docker.io docker-compose-plugin

sudo npm install -g pm2
sudo usermod -aG docker deploy
# выйти и зайти снова: exit → ssh deploy@...
```

---

## 3. Клонировать и задеплоить

```bash
cd ~
git clone https://github.com/davydovavic002-cmyk/paliceramics.git
cd paliceramics

export POSTGRES_PASSWORD='придумай_сильный_пароль'
export ADMIN_INITIAL_PASSWORD='пароль_для_Палины_в_админке'

chmod +x deploy/server-deploy.sh
./deploy/server-deploy.sh
```

Скрипт: Docker Postgres → `prisma db push` → seed → build → PM2.

Проверка:

```bash
curl -I http://127.0.0.1:3556
pm2 status
```

---

## 4. Nginx + HTTPS

```bash
sudo cp ~/paliceramics/deploy/nginx-pali.neostudio.space.conf /etc/nginx/sites-available/pali.neostudio.space
sudo ln -sf /etc/nginx/sites-available/pali.neostudio.space /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d pali.neostudio.space
```

Открой: https://pali.neostudio.space  
Админка: https://pali.neostudio.space/admin — пароль из `ADMIN_INITIAL_PASSWORD`.

---

## 5. Обновление после правок

На сервере:

```bash
cd ~/paliceramics
git pull
npm install
npm run build
pm2 restart pali
```

Если менялся `prisma/schema.prisma`:

```bash
npx prisma db push
```

---

## Переменные окружения

Шаблон: `deploy/env.example` → скопировать в `.env.local`.

| Переменная | Зачем |
|------------|--------|
| `DATABASE_URL` | PostgreSQL |
| `SESSION_SECRET` | сессия админки (обязательно в prod) |
| `ADMIN_INITIAL_PASSWORD` | только при первом seed |
| `NEXT_PUBLIC_SITE_URL` | `https://pali.neostudio.space` |
| `NEXT_PUBLIC_USE_INBOX_API` | `true` — заявки в БД |

---

## Бэкап БД

```bash
cd ~/paliceramics
docker compose exec postgres pg_dump -U pali pali_ceramics > backup-$(date +%F).sql
```
