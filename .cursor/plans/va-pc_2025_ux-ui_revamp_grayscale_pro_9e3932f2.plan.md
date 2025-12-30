---
name: va-pc_2025_ux-ui_revamp_grayscale_pro
overview: Полный UX/UI-ревамп VA‑PC в минималистичном «glassmorphism» стиле с фирменным фиолетовым. Внедрение новой палитры, системных токенов, перерисовка ключевых блоков и улучшение UX каталога/карточки/конфигуратора, производительности, SEO и доступности.
todos:
  - id: ds-tokens-add
    content: Ввести новые CSS‑токены палитры в src/app/globals.css (:root), включая BG/Accent/Text/Border/Glass.
    status: pending
  - id: ds-tailwind-colors
    content: "Расширить tailwind.config.ts цветами по ТЗ (accent #9A47EF, accent‑2 #795BAF, ...), завести алиасы для обратной совместимости."
    status: pending
  - id: ds-utils-update
    content: Переписать .glass-card/.card-hover/.focus-ring/.skeleton под новые токены и контрасты.
    status: pending
  - id: ds-typography
    content: "Проверить типографику Inter: веса, размеры, трекинг; унифицировать h1–h6 и параграфы в globals.css."
    status: pending
  - id: ds-shadows
    content: "Новые тени: мягкие фиолетовые glow‑варианты, убрать лишние RGB‑эффекты."
    status: pending
  - id: header-slim
    content: "Упростить шапку: меньше фоновых орбов, прозрачное стекло, повышенный контраст ссылок."
    status: pending
  - id: header-cta
    content: Основной CTA в шапке — Telegram, единый стиль кнопки (accent).
    status: pending
  - id: header-mobile-sheet
    content: Мобильное меню как полноэкранный sheet с крупными ссылками/CTA, блок контактных кнопок.
    status: pending
  - id: footer-tight
    content: Сжать отступы/сетку футера, упростить фон, оставить лёгкую сетку/орбы с низкой альфой.
    status: pending
  - id: footer-contacts
    content: Ясные контакты + расписание + юридические PDF, видимые ссылки, иконки монохром.
    status: pending
  - id: home-hero-image
    content: Выбрать 1 PNG с прозрачным фоном из public/ и подготовить WebP+LQIP под Hero.
    status: pending
  - id: home-hero-copy
    content: Короткий заголовок+саб, без лишних слов, выгоды и главные модели (4070/4080/4090).
    status: pending
  - id: home-hero-ctas
    content: "Две кнопки: «Написать» (primary) и «Каталог» (secondary). Проверить клавиатурную навигацию."
    status: pending
  - id: home-trust-strip
    content: "Перерисовать Trust‑метрики в компактные бейджи: YouTube, VK, гарантия, собранные ПК."
    status: pending
  - id: home-services
    content: 6 стеклянных карточек услуг с иконками и короткими подзаголовками + линк на подробности.
    status: pending
  - id: home-featured-products
    content: "Унифицировать карточки в блоке «Лучшee решение»: единая высота, прайс, CTA, бейджи."
    status: pending
  - id: home-installments-interactive
    content: "Сделать интерактивный блок рассрочки: центр‑ПК + прожектор + пошаговые подсказки (Framer/CSS)."
    status: pending
  - id: home-stages
    content: Простая вертикальная/горизонтальная шкала этапов — без перегруза анимацией.
    status: pending
  - id: home-bundle-callouts
    content: "Пересобрать «Вместе с ПК вы получите»: центр‑ПК + radial callouts (гарантия, чек/коробки, настройка, 24/7)."
    status: pending
  - id: home-remove-gifts-btn
    content: Удалить кнопку «получить подарки» из текущего раздела Gifts.
    status: pending
  - id: home-cases
    content: "Витрина кейсов: 3–6 карточек с hover‑подсветкой, ссылкой на видео/пост."
    status: pending
  - id: home-works-gallery
    content: Галерея работ (PNG/JPG из public/works), сетка с модальным просмотром.
    status: pending
  - id: home-cta-form
    content: Финальная CTA‑форма (имя, телефон, комментарий), минимализм, согласие на обработку.
    status: pending
  - id: catalog-filter-sidebar
    content: Прилипающая боковая панель фильтров, заметные заголовки/свичи/чипы.
    status: pending
  - id: catalog-mobile-filters
    content: Bottom‑sheet фильтры на мобильном с кнопками «Показать N», «Сбросить».
    status: pending
  - id: catalog-product-card
    content: "Единый вид карточки: фото 1:1, прайс, CTA, бейдж наличия; состояние hover без скачков."
    status: pending
  - id: catalog-empty-state
    content: Дружелюбное пустое состояние с кнопкой сброса фильтров.
    status: pending
  - id: catalog-error-state
    content: Понятный экран ошибки, кнопка «Повторить», лог для Sentry.
    status: pending
  - id: catalog-skeleton
    content: Лёгкий skeleton в стиле новой палитры (без ярких градиентов).
    status: pending
  - id: product-gallery
    content: Галерея 1:1 с превью, zoom, keyboard‑nav; оптимизация размеров, lazy boundary.
    status: pending
  - id: product-sticky-cta
    content: "Липкая правая колонка: прайс, кнопки «Написать», «Рассрочка», бейджи гарантий."
    status: pending
  - id: product-spec-grid
    content: Сетка ключевых компонентов (CPU/GPU/RAM/SSD/PSU/CASE) в стеклянных плитках.
    status: pending
  - id: product-structured-data
    content: Добавить Product/Offer JSON‑LD в карточку (цена/валюта/наличие).
    status: pending
  - id: product-related
    content: "«Похожие товары» в конце: 4–6 карточек."
    status: pending
  - id: configurator-visual-trim
    content: Убрать лишние паттерны, оставить стекло и подсказки; плотнее сетка.
    status: pending
  - id: configurator-compat
    content: Расширить проверки совместимости (сокеты/длины/высоты/питание), ясные статусы.
    status: pending
  - id: configurator-progress
    content: Ясный прогрессбар, подсветка незаполненных слотов, итог/рассрочка.
    status: pending
  - id: configurator-share
    content: "Поделиться конфигом: сериализация в query/short‑URL."
    status: pending
  - id: media-curation
    content: Собрать подборку PNG/WebP из public/, разложить по разделам (hero/cards/backgrounds).
    status: pending
  - id: media-lqip
    content: Сгенерировать blurDataURL/placeholder для LCP изображений.
    status: pending
  - id: perf-lcp
    content: "LCP < 2.0s: preload hero, уменьшить JS в первом экране, отложить тяжёлые секции."
    status: pending
  - id: perf-inp
    content: "INP < 200ms: уменьшить эффекты framer, использовать CSS‑анимации, убрать лишние listeners."
    status: pending
  - id: perf-assets
    content: Проверить бандл-анализ, code‑splitting, tree‑shaking и prefetch маршрутов.
    status: pending
  - id: a11y-contrast
    content: Проверить контрасты по WCAG AA (цвета текста/иконок/бордеров).
    status: pending
  - id: a11y-focus
    content: Единые видимые focus‑rings, проверка таб‑навигации.
    status: pending
  - id: a11y-motion
    content: Полная поддержка prefers-reduced-motion — отключить/упростить анимации.
    status: pending
  - id: seo-metadata
    content: Ревизия метаданных, title/desc для страниц, OG/Twitter, каноникал.
    status: pending
  - id: seo-sitemap
    content: Актуализировать sitemap/robots, проверить индексацию категорий/товаров.
    status: pending
  - id: seo-breadcrumbs
    content: Breadcrumb JSON‑LD на каталоге/карточке.
    status: pending
  - id: analytics-events
    content: "Подключить события: клики по CTA, фильтры, отправка форм, просмотр карточек."
    status: pending
  - id: logs-sentry
    content: Подключить Sentry для ошибок клиента/SSR.
    status: pending
  - id: routes-404-500
    content: Красивые страницы 404/500 в новом стиле.
    status: pending
  - id: copy-unification
    content: Унифицировать тексты кнопок/лейблов/состояний (RU), убрать двусмысленности.
    status: pending
  - id: forms-validation
    content: Единая валидация форм, маска телефона, состояния загрузки/ошибок.
    status: pending
  - id: assets-cleanup
    content: Очистить неиспользуемые ассеты/старые компоненты Hero/*, свести к единому Hero.
    status: pending
  - id: images-alt
    content: Alt‑тексты и подписи к медиа, проверка доступности каруселей.
    status: pending
  - id: build-checks
    content: "Ввести pre‑commit задачи: lint/style/type/test, запрет на большие изображения без оптимизации."
    status: pending
  - id: qa-breakpoints
    content: Сквозной QA на xs/sm/md/lg/xl/3xl, фикса коллапсов сеток и переполнений.
    status: pending
  - id: qa-mobile
    content: "Плотнее мобильные экраны: tap‑targets ≥ 44px, sticky CTA, жесты."
    status: pending
  - id: perf-budget-ci
    content: Performance budged в CI (Lighthouse CI) с порогами и регресс‑алертами.
    status: pending
  - id: catalog-virtualization
    content: Виртуализация списков/ленивая подгрузка карточек, контроль памяти.
    status: pending
  - id: catalog-price-slider
    content: Тонкий прайс‑слайдер с числами и быстрой корректировкой (input).
    status: pending
  - id: catalog-sort
    content: "Улучшить сортировку: по цене/новизне/популярности, кнопки/селект единообразны."
    status: pending
  - id: product-video
    content: "Опционально: видео в карточке (YouTube/VK), аккуратный плеер без лишних блоков."
    status: pending
  - id: trust-badges
    content: Единый набор бейджей доверия (гарантия, оплата, доставка), в Hero/карточке/футере.
    status: pending
  - id: telemetry-scroll
    content: События видимости секций (Hero/Installments/CTA) для аналитики.
    status: pending
  - id: microcopy-installments
    content: Чёткие тексты условий рассрочки и подсказок в интерактиве.
    status: pending
  - id: cleanup-animations
    content: Сократить фоновые частицы/орбы, оставить 1–2 мягких света, снизить альфу.
    status: pending
  - id: catalog-empty-img
    content: Иллюстрация для empty‑state каталога (минималистичный ПК).
    status: pending
  - id: configurator-data
    content: Подготовить исходник данных комплектующих (JSON/API), единый формат specs.
    status: pending
  - id: pwa-meta
    content: "Базовая PWA‑настройка: theme‑color, icons, manifest (по желанию)."
    status: pending
  - id: security-headers
    content: Проверить и настроить заголовки безопасности (CSP/COOP/COEP по возможности).
    status: pending
  - id: telemetry-errors
    content: Легковесные отчёты ошибок пользователям (toast) с шагом «повторить».
    status: pending
  - id: forms-consent
    content: Чекбоксы согласия/политики в формах + ссылки на PDF.
    status: pending
  - id: repo-readme
    content: README по дизайн‑системе и правилам использования токенов/компонентов.
    status: pending
  - id: migration-map
    content: Карта замены старых цветовых классов на новые (eslint‑rule/поиск).
    status: pending
  - id: hero-preload
    content: Правильный preload hero‑картинки и приоритетный fetch.
    status: pending
  - id: header-reduce-motion
    content: Упрощение анимаций шапки при prefers‑reduced‑motion.
    status: pending
  - id: footer-legal
    content: Проверить валидность ссылок на политику/оферту, обновить при необходимости.
    status: pending
  - id: vk-api-health
    content: Наблюдение за API VK (таймауты/ретраи/плейсхолдеры при падении).
    status: pending
  - id: shorts-works
    content: Перекрёстные ссылки из работ на Shorts/Gallery (если есть).
    status: pending
  - id: sitemap-media
    content: Добавить media entries в sitemap (важные страницы/категории).
    status: pending
  - id: og-previews
    content: Сгенерировать OG‑превью (варианты для главной/каталога/карточки).
    status: pending
  - id: end-to-end-smoke
    content: "E2E smoke: открытие главной → каталог → карточка → контакт/рассрочка."
    status: pending
---

# VA‑PC 2025 UX‑UI Revamp (Grayscale Pro + Purple)

## Цели

- Современный минималистичный «glassmorphism» в фирменных фиолетовых оттенках
- Чёткая визуальная иерархия, высокие контрасты, меньше «RGB‑шума»
- Быстрый LCP/INP, лёгкая анимация, дружелюбный мобильный UX
- Сильная витрина: Hero, рассрочка с интерактивом, «вместе с ПК вы получаете» (callouts), кейсы/работы
- Конверсия: заметные CTA, простые фильтры, понятная карточка товара

## 1) Design System и токены

- Добавить новую палитру и CSS‑переменные. Отразить из брифа:
- BG: #090909, #101010, card: #161717, hover: #1F1F1F, border: #2D2D2F, neutral surface: #444447
- Accent: #9A47EF, Accent‑2: #795BAF, Accent‑soft: #B687EA, Accent‑dark: #453367, Muted: #3C3448
- Text: primary #CFC9E1, secondary #BEB7D2, highlight #FCD5FE, white #FFFFFF
- В Tailwind расширить цветовую схему и заменить текущие «ultraviolet»/«neon» ссылки на новые токены (через alias‑слой для совместимости).
- Обновить глобальные утилиты: glass‑card, border, focus‑rings, skeleton.

Файлы:

- [src/app/globals.css](src/app/globals.css) — новые :root переменные + утилиты
- [tailwind.config.ts](tailwind.config.ts) — цвета, тени, radius, screens
- Компоненты в [src/components/ui/](src/components/ui/) — кнопки, карточки, инпуты, badge, tooltip

## 2) Шапка/подвал

- Header: компактнее, меньше RGB, прозрачное стекло на скролле, читабельные ссылки, CTA = Telegram
- MobileNav: фулл‑screen sheet с крупной типографикой, быстрые CTA
- Footer: плотнее, контрастнее, понятные ссылки, социальные и юридические блоки, контакты

Файлы: [src/components/layout/header.tsx](src/components/layout/header.tsx), [src/components/layout/footer.tsx](src/components/layout/footer.tsx)

## 3) Главная

- Hero: один «геройский» ПК (PNG на прозрачном фоне), мягкая подсветка, заголовок/саб, 2 CTA
- Trust‑строка: 250K+ YouTube, VK, гарантия, «собрано ПК» — компактные бейджи
- Services: 6 карточек услуг в стеклянных плитках
- Featured: 6–9 товара из каталога (единый card‑вид)
- Рассрочка: интерактивный блок — «проектор» на центральный ПК, по очереди всплывают шаги/условия (Framer/CSS)
- Stages: простая вертикальная/горизонтальная шкала
- «Вместе с ПК вы получите»: центр‑ПК + radial callouts («Фирменная гарантия», «Чек и коробки», «Проф. настройка», «Поддержка 24/7»). Удалить кнопку «получить подарки»
- Cases/Works: галерея из ваших фото (PNG/JPG), hover‑подсветки
- CTA‑форма: короткая, один экран

Файлы: [src/app/page.tsx](src/app/page.tsx), [src/components/home/*](src/components/home/)

## 4) Каталог

- Лёгкая сетка, прилипающая панель фильтров, bottom‑sheet фильтры на мобильном
- Карточка товара: однотипная высота, яркий прайс/CTA, метки «в наличии/б.у./топ продаж»
- Пустые/ошибочные состояния — дружелюбные, с явным действием

Файлы: [src/app/catalog/page.tsx](src/app/catalog/page.tsx), [src/components/catalog/*](src/components/catalog/)

## 5) Карточка товара

- Галерея: 1:1 вид, превью‑лента, зум, переспект. тень; «липкая» правая колонка
- Блок «что внутри»: ключевые компоненты в 4–6 стеклянных плитках
- CTA: «Написать в Telegram», «Оформить рассрочку»
- SEO/структурка: Product + Offer + AggregateRating (если возможно)

Файлы: [src/app/product/[slug]/page.tsx](src/app/product/%5Bslug%5D/page.tsx), [src/components/product/*](src/components/product/)

## 6) Конфигуратор

- Упростить визуал, оставить «стекло», меньше декоративных паттернов
- Улучшить подсказки совместимости, чёткий прогресс, итог/рассрочка/поделиться
- Позже — источник данных (прайс лист), сериализация сборки в шорт‑URL

Файлы: [src/app/configurator/page.tsx](src/app/configurator/page.tsx), [src/components/configurator/*](src/components/configurator/)

## 7) Медиа и перфоманс

- Кураторский набор PNG/WebP, генерация LQIP/blurDataURL
- Сжатие, правильные sizes/srcSet, приоритет для Hero
- Уменьшить фоновые анимации, больше CSS, меньше JS; respect prefers‑reduced‑motion

## 8) Контент и тональность

- Заголовки короче, выгоды на первом экране, без лишних «подарков»
- Единая лексика кнопок/лейблов/состояний

## 9) Доступность/SEO/Аналитика

- Контраст ≥ WCAG AA, фокус‑кольца, таб‑навигация
- Микроразметка: Organization, Product, Breadcrumb
- OG/Twitter, canonicals, sitemap/robots, 404/500 страницы
- Метрики: Yandex/GA4, события CTA

## 10) Тестирование и контроль качества

- Перформанс‑бюджеты: LCP < 2.0s, INP < 200ms, CLS < 0.02
- Регрессия UI на ключевых брейкпоинтах, e2e на CTA/фильтры/заказ