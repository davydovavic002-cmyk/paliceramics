# Деплой paliceramics.com

> **Первый деплой на VPS:** пошаговый чеклист → [VPS-FIRST-STEPS.md](./VPS-FIRST-STEPS.md)

Целевой домен: **https://paliceramics.com**

См. также `deploy/DEPLOY.md` для staging на `pali.neostudio.space`.

---

## 1. DNS

| Тип | Имя | Значение |
|-----|-----|----------|
| A   | @   | IP VPS   |
| A   | www | IP VPS   |

Проверка:

```bash
dig paliceramics.com +short
```

---

## 2. Переменные окружения

Скопируй `.env.example` → `.env.local` на сервере (или в панели Vercel):

```env
NEXT_PUBLIC_SITE_URL=https://paliceramics.com
NEXT_PUBLIC_USE_INBOX_API=true
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=studio@paliceramics.com
STUDIO_INBOX_EMAIL=hello@paliceramics.com
```

Без `RESEND_API_KEY` формы принимаются через `/api/inbox`, но email не отправляется — заявки дублируются в localStorage админки (demo fallback).

---

## 3. Сборка и запуск (VPS + PM2)

```bash
cd /var/www/pali
git pull origin main
npm install
npm run build
pm2 restart pali
```

Порт по умолчанию: **3556** (`npm run start`).

---

## 4. Nginx

Пример server block:

```nginx
server {
    listen 80;
    server_name paliceramics.com www.paliceramics.com;

    location / {
        proxy_pass http://127.0.0.1:3556;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

SSL:

```bash
sudo certbot --nginx -d paliceramics.com -d www.paliceramics.com
```

---

## 5. Vercel (альтернатива)

1. Import GitHub repo
2. Framework: Next.js
3. Env vars из `.env.example`
4. Custom domain: `paliceramics.com`

---

## 6. Чеклист перед go-live

- [ ] HTTPS работает
- [ ] `/privacy` — polityka prywatności
- [ ] Cookie banner + mapa tylko po zgodzie
- [ ] Resend wysyła na `STUDIO_INBOX_EMAIL`
- [ ] Admin: zmień hasło demo / dodaj prawdziwe auth
- [ ] Export backup z admina po każdej większej edycji
- [ ] Review prawnika RODO (PL)

---

## 7. Backup danych

**Demo:** Admin → **Export backup** → JSON z localStorage.

**Prod (next step):** Supabase + cron export — см. `docs/ROADMAP.md` §4.
