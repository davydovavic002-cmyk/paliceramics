# Что ещё не продакшен

> Статус: **демо / MVP для локальной проверки**  
> Обновлено: август 2026  
> Связанные документы: [ROADMAP.md](./ROADMAP.md), [deploy/paliceramics.com.md](../deploy/paliceramics.com.md)

Сайт можно полностью прогнать локально (`npm run dev` → http://localhost:3556).  
Ниже — всё, что **нельзя считать готовым к запуску на paliceramics.com** без доработок.

---

## 1. Инфраструктура и деплой

| Что | Сейчас | Нужно для prod |
|-----|--------|----------------|
| Хостинг | Только локально | Деплой на VPS или Vercel |
| Домен | — | paliceramics.com + HTTPS |
| Сборка prod | Не проверена в CI | `npm run build` на сервере, мониторинг |

Инструкция: `deploy/paliceramics.com.md`, staging: `deploy/DEPLOY.md`.

---

## 2. Данные и backend

| Что | Сейчас | Нужно для prod |
|-----|--------|----------------|
| Каталог, тексты, inbox | `localStorage` в браузере (`pali-admin-data`) | База (Supabase / Postgres) + API |
| Синхронизация | Данные только на одном устройстве | Общий backend для всех посетителей и админки |
| Backup | Кнопка **Export backup** в админке (ручной JSON) | Автоматический backup на сервере |
| SSR / SEO shop | Shop читает данные на клиенте | GET `/api/products`, fallback seed при build |

Миграция описана в ROADMAP §4.

---

## 3. Почта и заявки

| Что | Сейчас | Нужно для prod |
|-----|--------|----------------|
| Waitlist, booking, voucher | POST `/api/inbox` + fallback в localStorage | Постоянное хранение на сервере |
| Email студии | Resend **не подключён** без `RESEND_API_KEY` | `.env`: `RESEND_API_KEY`, `STUDIO_INBOX_EMAIL` |
| Voucher покупателю | Только PNG в браузере | PDF + письмо после оплаты |
| Certificate email | Placeholder «pending-smtp» | SMTP / Resend + очередь |

Пример переменных: `.env.example`.

---

## 4. Админка и безопасность

| Что | Сейчас | Нужно для prod |
|-----|--------|----------------|
| Вход | Пароль `pali` в клиенте (demo) | Серверная auth (Supabase Auth / NextAuth) |
| Сессия | Сбрасывается при перезагрузке страницы | Защищённые cookies / JWT |
| RODO в prod | Данные в localStorage — не для персональных данных | Хранение на сервере, HTTPS, политики доступа |

---

## 5. Контент (placeholder до материалов клиента)

- Адрес, часы, точный embed карты — заглушки в **Admin → Content → Contacts**
- FAQ, отзывы, блоки About — демо-тексты, редактируются в админке
- Фото товаров — из seed, не финальная съёмка
- Hero / иллюстрации — placeholder (3D/canvas есть, финальные ассеты — позже)
- Контакты бронирования (IG / email / WA) — placeholder в `lib/booking.ts`

---

## 6. Юридическое (RODO / Польша)

| Что | Сейчас | Нужно для prod |
|-----|--------|----------------|
| Polityka prywatności | Страница `/privacy` — **черновик** | Review prawnika (PL) |
| Checkbox zgody | Есть на формах + ссылка на policy | Уточнить формулировки с юристом |
| Cookie banner | Essential + отдельное согласие на карту | При необходимости — полноценный CMP |
| Retencja danych | Описана в policy текстом | Реализовать удаление по запросу на backend |

---

## 7. Функции из ТЗ — частично или не в prod-режиме

- **Отправка сертификата на email** — UI есть, почта нет
- **Open Studio** — сознательно не делаем в первой итерации
- **Категория «на заказ»** — не делаем
- **USD** — убран из админки
- **Phase 1–2 в ROADMAP** — реализованы в коде, чекбоксы в ROADMAP могут быть не обновлены

---

## 8. Чеклист перед go-live

- [ ] `npm run build` без ошибок на сервере
- [ ] Деплой + HTTPS на paliceramics.com
- [ ] `.env.local` с Resend и inbox email
- [ ] Backend (хотя бы inbox + products) вместо localStorage
- [ ] Настоящий пароль / auth для `/admin`
- [ ] Финальный контент от Paliny (тексты, адрес, фото)
- [ ] Review polityki prywatności юристом
- [ ] Ручной export backup после миграции данных
- [ ] Smoke-test: shop, формы, inbox, privacy, cookies, карта

---

## 9. Как проверять сейчас (локально)

```bash
npm run dev
```

| URL | Проверка |
|-----|----------|
| http://localhost:3556 | Главная, все секции, тема, язык |
| http://localhost:3556/shop | Каталог |
| http://localhost:3556/admin | Пароль `pali`, Inbox, Content, Export backup |
| http://localhost:3556/privacy | Политика |
| http://localhost:3556/demo | Motion levels |

**Важно:** заявки из форм видны в Inbox **в том же браузере**, где отправляли форму (localStorage demo).
