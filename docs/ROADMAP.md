# Pali Ceramics — Roadmap & Technical Plan

> Обновлено после согласования ТЗ (август 2026).  
> Домен: **paliceramics.com** · Языки: **PL (default) + EN**  
> **Не prod:** см. [NOT-PRODUCTION.md](./NOT-PRODUCTION.md)

---

## 1. Зафиксированные решения

| Тема | Решение |
|------|---------|
| Архитектура | Отдельные URL, не одностраничник для shop |
| Языки | PL первым, EN вторым |
| Референсы UI | Текущие концепты в коде (`EditorialLookbook`, `FilteredCatalog`, `DateBuilderConcept`, about-tabs) |
| Приоритет разработки | **Витрина → карточки товара → админка под shop** |
| Hero иероглифы | Убрать (в т.ч. из Header) |
| Hero canvas/3D | Оставить, иллюстрации — placeholder до ассетов |
| About | 3–4 блока, тексты позже; видео — не сейчас |
| Порядок секций | Hero → Gallery/Lookbook → Workshops → About → (новые блоки) |
| Workshops | Конструктор: тип МК → дата → контакт |
| Open Studio | **Не делаем** в первой итерации |
| Пожелания в форме | Убрать |
| Контакты бронирования | Placeholder (Instagram / Email / WhatsApp) |
| Lookbook / Catalog | Lookbook на главной, каталог на `/shop` |
| «На заказ» как категория | **Не делаем** |
| URL товара | `/shop/PALI-001` (по SKU) |
| Рекомендации | Из той же категории / коллекции |
| Stock = 0 | Нет в наличии + лист ожидания |
| Валюта | Только **PLN** |
| Тема сайта | Тёмная по умолчанию; переключатель на беж (как Raw Clay в админке) |
| Backend сейчас | Next.js + **localStorage** (демо/MVP) |
| Заявки | Сбор в админке (inbox) — см. §5 RODO |

---

## 2. Карта URL (целевая)

```
/                     — главная (hero, lookbook, workshops, about, FAQ, …)
/shop                 — каталог с фильтрами по категориям
/shop/[sku]           — карточка товара (PALI-001)
/demo                 — лаборатория motion/theme (dev)
/admin                — CRM / админка
```

**Позже (не MVP):**
```
/certificates         — покупка сертификата (или секция на главной)
/privacy              — polityka prywatności (RODO)
```

---

## 3. Фазы разработки

### Phase 1 — Витрина & Shop (текущий приоритет)

- [ ] Роутинг `/shop` и `/shop/[sku]`
- [ ] Lookbook на `/` — editorial-сетка по коллекциям (`EditorialLookbook`)
- [ ] CTA «Shop all» / «Zobacz katalog» → `/shop`
- [ ] Каталог `/shop` — фильтры по категориям (`FilteredCatalog`)
- [ ] Страница товара: фото, описание (глина, глазурь, размеры), PLN, статус, stock
- [ ] Кнопка связи (placeholder mailto / форма → inbox)
- [ ] Рекомендации: 2–4 товара из той же `categoryId`
- [ ] Stock = 0 → badge «Brak w magazynie» + форма листа ожидания → admin inbox
- [ ] Убрать иероглифы из Header и hero-микроэлементов
- [ ] PL как default locale (`LanguageContext`)
- [ ] Убрать USD из админки и типов
- [ ] Связать публичный shop с данными из `AdminDataContext` / localStorage

### Phase 2 — Workshops & Forms

- [ ] Внедрить `DateBuilderConcept` как основной UI
- [ ] Убрать поле пожеланий
- [ ] Placeholder-контакты (IG / email / WA)
- [ ] Заявки бронирования → вкладка **Inbox** в админке
- [ ] Расширить админку workshops: типы МК, цены, слоты (уже частично есть)

### Phase 3 — Контент-блоки (placeholders → контент)

- [x] FAQ — редактирование EN/PL в админке
- [x] Отзывы — placeholder-карточки → реальные тексты
- [x] Контакты — адрес Варшавы, карта, часы (placeholder → от клиента)
- [x] Доставка / самовывоз — placeholder-тексты в админке
- [x] About — лаконичные блоки (коллаж + деконструкция), слот под тексты

### Phase 4 — Сертификаты

- [x] Форма: номинал, имя получателя, email покупателя
- [x] Генератор PDF/image на лету (имя на карточке)
- [ ] Отправка на email — **требует backend + SMTP** (Resend / SendGrid / własny SMTP)
- [x] Заявки сертификатов → admin inbox
- [x] Placeholder UI до подключения почты

### Phase 5 — Hero & polish

- [x] Placeholder под иллюстрации «certificate style»
- [x] Микро-элементы вместо иероглифов (текущий Japandi-стиль)
- [x] Переключатель темы: dark default + beige toggle (site-wide)
- [x] Минимальные motion / hover на карточках каталога

### Phase 6 — Production & compliance

- [ ] Деплой на **paliceramics.com** — см. `deploy/paliceramics.com.md`
- [x] RODO: polityka prywatności, checkbox zgody, retencja danych
- [x] Migracja backend (§4) — API `/api/inbox` + `.env.example` (stub, Supabase — next)
- [x] Prawdziwy SMTP, backup danych — Resend hook + Export backup в админке

---

## 4. План миграции: localStorage → backend

> **Сейчас:** всё в `localStorage` (`pali-admin-data`). Подходит для демо и разработки UI.  
> **Не подходит для prod:** данные только в браузере одного пользователя, нет email, нет backup, RODO.

### Рекомендуемый стек (когда будете готовы)

| Слой | Вариант A (простой) | Вариант B (масштабируемый) |
|------|---------------------|----------------------------|
| Hosting | Vercel | Vercel / własny VPS |
| DB | Supabase (Postgres) | Supabase / PlanetScale |
| Auth admin | Supabase Auth + magic link | NextAuth + credentials |
| File storage | Supabase Storage / Cloudinary | S3 / Cloudinary |
| Email | Resend | Resend / Postmark |
| Forms API | Next.js Route Handlers | + queue (Inngest) для PDF |

### Таблицы (черновик схемы)

```
products          — sku, title, price_pln, stock, category_id, status, specs, images
categories        — id, label, sort_order
workshop_types    — id, title, price_pln, duration, description
workshop_slots    — id, type_id, date, time, spots
site_copy         — key/value JSON (FAQ, hero, sections)
inbox_messages    — type (booking|waitlist|certificate|contact), payload, created_at, read
waitlist          — sku, email, lang, consent, created_at
certificates      — nominal, recipient_name, buyer_email, pdf_url, status
reviews           — author, text, lang, visible, sort_order
```

### API routes (Next.js)

```
POST /api/inbox/booking
POST /api/inbox/waitlist
POST /api/inbox/certificate   → generate PDF → send email
GET  /api/products
GET  /api/products/[sku]
```

### Миграция данных

1. Export `pali-admin-data` из localStorage → JSON script
2. Seed script в Supabase
3. Site читает из API; fallback на static seed для SSR/build
4. Admin пишет в API вместо localStorage

### Оценка усилий

| Этап | Ориентир |
|------|----------|
| Supabase + products API | 2–3 дня |
| Admin auth + CRUD | 2–3 дня |
| Inbox + waitlist | 1–2 дня |
| Email + certificate PDF | 2–4 дня |
| RODO (policy, consent UI) | 1 день + review prawnika |

---

## 5. RODO / Польша — сбор заявок в админке

**Можно** собирать email и заявки, если:

1. **Polityka prywatności** — кто administratorem danych (Palina / studio), cel (booking, waitlist), okres przechowywania
2. **Checkbox zgody** przy кажdej форме (waitlist, booking, certificate) — nie pre-checked
3. **Prawo dostępu/usunięcia** — kontakt email do Paliny
4. **Minimalizacja** — zbierać tylko to, co potrzebne (email, SKU, data)
5. **Bezpieczeństwo** — w prod: HTTPS, hasło admin, nie trzymać danych osobowych w localStorage na stałe

**Na etapie demo (localStorage):** dodać UI zgody i disclaimer „dane testowe, nie produkcyjne”.

**Mapa Google:** embed wymaga informacji o cookies — uwzględnić w cookie banner (Phase 6).

---

## 6. Админка — целевой функционал

### Сейчас есть
- Products (inventory, categories, stock, status)
- Workshops (slots toggle)
- Site copy (announcement, spotlight, section headers)
- Themes (dark / Raw Clay)

### Нужно добавить (по приоритету)

| Модуль | Содержание |
|--------|------------|
| **Shop display** | Порядок в lookbook, главное фото, specs (глина/глазурь/размеры) |
| **Workshops** | Типы МК, цены PLN, слоты, описания |
| **FAQ** | Пары вопрос/ответ EN + PL, порядок |
| **Reviews** | Текст, автор, visible on/off |
| **Contacts** | Адрес, карта embed URL, email, IG, WA, часы |
| **Delivery** | Тексты доставка/самовывоз EN + PL |
| **Inbox** | Booking, waitlist, certificates, contact — read/unread |
| **Certificates** | Номиналы PLN, шаблон карточки (placeholder) |

### Убрать
- USD везде
- Open Studio (пока)
- Категория «на заказ»

---

## 7. Тема сайта

- **Default:** тёмная (Glazed Matte / текущий dark Japandi)
- **Toggle:** беж Raw Clay — переключатель в header (как в админке)
- **Акцент:** синий/indigo (уже есть `--indigo` в tokens) — кнопки, ссылки, focus
- Хранение: `localStorage` `pali-site-theme` + sync с demo controls (опционально убрать `/demo` из prod)

---

## 8. Открытые вопросы (ждём от клиента)

- [ ] Точный адрес студии + embed Google Maps
- [ ] Instagram @, email, WhatsApp
- [ ] Тексты About (EN/PL)
- [ ] Номиналы сертификатов PLN
- [ ] Реальные отзывы
- [ ] Дедлайн / дата soft launch
- [ ] Иллюстрации hero / certificate style assets

---

## 9. Технический долг / cleanup

- [ ] Удалить USD из `AdminProduct`, seed, UI
- [ ] Убрать kanji из `Header`, `siteContent.nav`, hero components
- [ ] Перенести `(site)/page.tsx` — lookbook без full catalog
- [ ] `ItemDetailDrawer` → заменить на `/shop/[sku]` или использовать как mobile fallback
- [ ] GDPR consent component (reusable)
- [ ] `docs/` — этот файл актуализировать после каждой фазы

---

## 10. Рекомендация по Phase 1 (следующие шаги в коде)

1. `defaultLanguage: 'pl'` в `LanguageContext`
2. Роуты `app/(site)/shop/page.tsx` + `app/(site)/shop/[sku]/page.tsx`
3. Hook `useShopProducts()` — merge admin localStorage + gallery seed
4. Расширить `AdminProduct`: `specs` (clay, glaze, dimensions), `lookbookSpan`, `collectionId`
5. Inbox types в `adminTypes.ts` + вкладка Inbox (waitlist first)
6. Header без kanji + link «Sklep» → `/shop`

---

*Документ для команды и клиента. Перед prod — review RODO z prawnikiem lub checklistą UODO.*
