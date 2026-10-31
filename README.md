# Карты 05 — лендинг

Next.js (App Router) + TypeScript + Prisma + Neon. Форма заявки сохраняет лид в базу
и присылает уведомление в Telegram.

## Стек

- Next.js 16 (App Router), React 19, TypeScript
- Prisma + Neon (Postgres)
- Деплой на Vercel

## Переменные окружения

Локально — файл `.env.local` (не коммитится), на проде — Vercel Project Settings → Environment Variables.
Полный список имён — в `.env.example`.

| Переменная | Назначение |
|---|---|
| `DATABASE_URL` | строка подключения к Neon (Postgres) |
| `TELEGRAM_BOT_TOKEN` | токен Telegram-бота от @BotFather |
| `TELEGRAM_CHAT_ID` | chat_id, куда бот шлёт уведомления о заявках |
| `NEXT_PUBLIC_SITE_URL` | боевой адрес сайта, например `https://karty05.ru` — для canonical, sitemap, robots, Open Graph. На Vercel без него берётся production-домен проекта |

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # и заполнить значения
npx prisma generate
npm run dev
```

## Шаги для продакшена

### 1. Создать Telegram-бота и узнать chat_id

1. В Telegram открыть [@BotFather](https://t.me/BotFather), выполнить `/newbot`, следовать инструкциям —
   в ответ придёт `TELEGRAM_BOT_TOKEN`.
2. Написать своему новому боту любое сообщение (иначе он не сможет писать вам первым).
3. Открыть в браузере:
   `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates`
4. В ответе найти `"chat":{"id": ...}` — это `TELEGRAM_CHAT_ID`.
   Если для получения заявок нужен групповой чат — добавить бота в группу, написать туда
   любое сообщение и повторить запрос `getUpdates`; id группы будет отрицательным числом.

### 2. Завести базу на Neon

1. Зарегистрироваться / зайти на [neon.tech](https://neon.tech), создать новый проект.
2. Скопировать connection string (Pooled connection) — это и есть `DATABASE_URL`.

### 3. Накатить миграцию вручную

**Важно:** `prisma migrate deploy` не запускается ни в CI, ни при сборке на Vercel.
Миграции применяются вручную через Neon SQL Editor.

1. Открыть Neon SQL Editor для своей базы.
2. Выполнить содержимое файла `prisma/migrations/20260826000000_init/migration.sql`
   (создаёт таблицу `Lead`).
3. Затем выполнить `prisma/migrations/20260826160000_rename_phone_to_telegram/migration.sql`
   (переименовывает колонку `phone` в `telegram` — форма теперь собирает Telegram-юзернейм,
   а не номер телефона).
4. Если схема будет меняться в будущем — добавлять новую миграцию тем же способом:
   писать SQL вручную (или сгенерировать через `prisma migrate diff` локально) и
   выполнять его в Neon SQL Editor, не через `migrate deploy`.

### 4. Задеплоить на Vercel

1. Импортировать репозиторий в Vercel.
2. В Project Settings → Environment Variables добавить `DATABASE_URL`,
   `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (для Production и Preview).
3. Build command: `prisma generate && next build` (уже прописан в `package.json`,
   Vercel подхватит его автоматически). Start command — стандартный `next start`,
   Vercel запускает его сам.
4. Задеплоить. Миграция к этому моменту уже должна быть накатана вручную (шаг 3) —
   без этого API `/api/lead` не сможет писать в таблицу `Lead`.

## Форма заявки

- `POST /api/lead` — валидирует имя (1–100 символов) и Telegram-юзернейм (5–32 символа,
  латиница/цифры/подчёркивание, опциональный `@`), проверяет согласие на обработку ПДн
  (`consent: true`), сохраняет лид в Neon через Prisma, отправляет уведомление в Telegram.
  Правила валидации общие для клиента и сервера — `lib/lead.ts`.
- Если отправка в Telegram упала — лид всё равно сохраняется, ошибка Telegram только
  логируется.
- Защита от спама:
  - скрытое honeypot-поле (`company`): если оно заполнено, запрос молча считается успешным
    без сохранения в базу;
  - лимит 5 запросов с одного IP за 10 минут (`lib/rateLimit.ts`, в памяти инстанса —
    останавливает всплески, но не является жёстким глобальным лимитом на serverless);
  - повторная заявка с тем же Telegram-юзернеймом в течение 10 минут не дублируется.

## Персональные данные

- `/privacy` (`app/privacy/page.tsx`) — политика обработки персональных данных по 152-ФЗ.
- `/consent` (`app/consent/page.tsx`) — отдельное согласие на обработку ПДн (ст. 9 152-ФЗ).
  В форме — обязательный неотмеченный чекбокс со ссылками на оба документа.
- Реквизиты оператора хранятся в одном месте — `lib/operator.ts`.

## SEO и производительность

- `app/robots.ts`, `app/sitemap.ts` — `/robots.txt` и `/sitemap.xml` (адрес из `lib/site.ts`).
- `app/icon.svg`, `app/apple-icon.png` — фавикон и иконка для iOS.
- `app/opengraph-image.png` — превью при отправке ссылки в мессенджеры и соцсети.
- На главной — структурированные данные JSON-LD: `ProfessionalService` (услуги и цены)
  и `FAQPage` (вопросы берутся из `lib/faq.ts` — там же их и редактировать).
- Шрифты подключены через `next/font` и раздаются с самого сайта, без запросов к Google.
- Главная — серверный компонент; на клиенте работают только `LeadForm`, `PageEffects`
  (анимации, верхняя плашка) и `PanoramaViewer`.
- Панорама (4096×2048 — больше многие телефоны не отображают) и скрипт Pannellum
  загружаются, только когда пользователь долистал до блока.
- Скриншоты «было/стало» — через `next/image` (WebP/AVIF, нужный размер под экран).
