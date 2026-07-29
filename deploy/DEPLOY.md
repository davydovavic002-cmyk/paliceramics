# Деплой pali.neostudio.space

Поддомен **pali.neostudio.space** → приложение на **localhost:3556**.

---

## 1. DNS

В панели домена `neostudio.space` добавь запись:

| Тип | Имя | Значение        |
|-----|-----|-----------------|
| A   | pali | IP твоего VPS  |

Подожди 5–30 мин, проверь:

```bash
ping pali.neostudio.space
```

---

## 2. Код на сервере

```bash
cd /var/www/pali          # или твоя папка
git pull origin main
npm install
npm run build
pm2 restart pali          # см. раздел 4
```

---

## 3. Nginx — имя файла и установка

**Как назвать:** `pali.neostudio.space` (без `.conf` в имени на Debian/Ubuntu — можно и с `.conf`).

Готовый конфиг лежит в репозитории:

`deploy/nginx/pali.neostudio.space.conf`

### На сервере (Linux):

```bash
# скопировать конфиг
sudo cp /var/www/pali/deploy/nginx/pali.neostudio.space.conf \
        /etc/nginx/sites-available/pali.neostudio.space

# включить сайт (симлинк)
sudo ln -sf /etc/nginx/sites-available/pali.neostudio.space \
            /etc/nginx/sites-enabled/pali.neostudio.space

# проверить синтаксис
sudo nginx -t

# применить
sudo systemctl reload nginx
```

Если `nginx -t` пишет **ok** — конфиг принят.

### SSL (HTTPS) — после того как HTTP работает:

```bash
sudo certbot --nginx -d pali.neostudio.space
```

Certbot сам допишет `listen 443 ssl` в этот же файл.

---

## 4. Запуск Next.js на порту 3556

```bash
cd /var/www/pali
npm run build
pm2 start npm --name pali -- start -- -p 3556
pm2 save
```

Проверка, что процесс слушает порт:

```bash
ss -tlnp | grep 3556
```

Должно быть что-то вроде `127.0.0.1:3556` или `0.0.0.0:3556`.

Локально на сервере:

```bash
curl -I http://127.0.0.1:3556
```

В браузере: **http://pali.neostudio.space**

---

## 5. Частые команды

| Задача              | Команда                    |
|---------------------|----------------------------|
| Порт занят?         | `ss -tlnp \| grep 3556`    |
| Логи nginx          | `sudo tail -f /var/log/nginx/error.log` |
| Статус nginx        | `sudo systemctl status nginx` |
| Перезапуск app      | `pm2 restart pali`         |
| Логи app            | `pm2 logs pali`            |

---

## 6. Обновление после правок

```bash
cd /var/www/pali
git pull origin main
npm install
npm run build
pm2 restart pali
```

Nginx трогать не нужно, если не менялся конфиг.
