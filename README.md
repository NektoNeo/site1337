# VA-PC Website

Премиальный сайт для продажи игровых компьютеров VA-PC.

## Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация (Grayscale Pro тема)
- **Framer Motion** - Анимации
- **React Query** - Кэширование данных
- **Prisma** - ORM (опционально)

## Дизайн-система: Grayscale Pro

Сайт использует минималистичную палитру:
- Основной фон: `#000000` (void black)
- Текст: белый/серый (`#ffffff`, `#e5e5e5`, `#a1a1aa`)
- Акцент: ультрафиолетовый (`#8B5CF6`, subtle glow)
- Без ярких magenta/cyan заливок — только тонкие рамки и лёгкие тени

## Структура проекта

```
src/
├── app/                   # Next.js App Router pages
│   ├── api/              # API routes
│   │   ├── shorts/       # YouTube Shorts API
│   │   ├── vk/           # VK Market API
│   │   ├── products/     # Products API
│   │   └── works/        # Works gallery API
│   ├── catalog/          # Каталог товаров
│   ├── product/          # Страница товара
│   ├── cart/             # Корзина
│   ├── checkout/         # Оформление заказа
│   └── configurator/     # Конфигуратор ПК
├── components/
│   ├── home/             # Секции главной страницы
│   ├── layout/           # Header, Footer, MobileContactDock
│   ├── ui/               # Базовые UI компоненты
│   ├── catalog/          # Компоненты каталога
│   ├── product/          # Компоненты страницы товара
│   ├── cart/             # Компоненты корзины
│   ├── configurator/     # Компоненты конфигуратора
│   └── seo/              # JSON-LD компоненты
├── lib/                   # Утилиты и сервисы
│   ├── youtube.ts        # YouTube API интеграция
│   ├── vk-cache.ts       # VK кэширование
│   └── query-client.tsx  # React Query provider
├── services/
│   └── vk-api.service.ts # VK Market API сервис
├── hooks/                 # React hooks
├── store/                 # Zustand stores
└── types/                 # TypeScript типы
```

## Переменные окружения

Создайте файл `.env.local` с переменными:

```env
# VK API (для каталога товаров)
VK_ACCESS_TOKEN=your_vk_access_token
VK_GROUP_ID=218975719

# YouTube API (для LIVE ленты Shorts)
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=UCvapc
YOUTUBE_PLAYLIST_ID=PLxxx  # Плейлист с Shorts

# База данных (опционально)
DATABASE_URL=postgresql://...

# Сайт
NEXT_PUBLIC_SITE_URL=https://va-pc.ru
```

### Получение VK Access Token

1. Создайте приложение VK: https://vk.com/editapp?act=create
2. Тип: Standalone-приложение
3. Получите токен через Implicit Flow с правами `market`

### Получение YouTube API Key

1. Создайте проект в Google Cloud Console
2. Включите YouTube Data API v3
3. Создайте API ключ

## Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Запуск production сервера
npm start
```

## Контент-процессы

### LIVE лента (YouTube Shorts)
- Автоматически подтягивает Shorts из плейлиста
- Кэшируется на 5 минут (ISR)
- Fallback на локальные изображения если API недоступен

### Каталог товаров (VK Market)
- Синхронизация с VK Market API
- Локальный кэш в Prisma DB
- Автоматический парсинг спецификаций из описания

### Галерея работ
- Изображения в `public/images/live/`
- VK альбом (опционально)
- Формат именования: `prev_svo_N.png`

## SEO

- JSON-LD: Organization, LocalBusiness, WebSite, Product, FAQ
- OpenGraph и Twitter Cards
- Семантическая разметка с H1/H2/H3
- Alt-тексты для всех изображений

## Производительность

- LCP: Hero изображение с `priority` и preload
- CLS: Фиксированные размеры изображений
- FID: Минимальный JS, lazy loading секций
- `prefers-reduced-motion` поддержка
- Intersection Observer для анимаций

## Доступность (A11y)

- Focus rings на интерактивных элементах
- ARIA labels на кнопках/ссылках
- Контраст текста ≥ 4.5:1
- Семантическая структура заголовков

## Деплой

Рекомендуется Vercel для автоматического деплоя:

```bash
npx vercel
```

## Лицензия

Proprietary © VA-PC
