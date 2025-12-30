# VA-PC Premium Site — Master Context

## Статус проекта
- **Дата начала:** 2025-12-28
- **Текущая фаза:** Не начата
- **Следующий шаг:** Фаза 1 - Agent A (Tokens)

## Архитектура агентов

### Координаторы
- **Context Manager:** Сохраняет контекст (этот файл), координирует
- **Code Reviewer:** `architect-reviewer` — проверяет после каждой фазы
- **QA Engineer:** `test-automator` + `ui-visual-validator`

### Рабочие агенты (порядок выполнения)
1. **A** (Tokens) → `frontend-developer` + `ui-styling`
2. **B** (UI Kit) → `frontend-developer` + `ui-styling` [параллельно с H]
3. **H** (Media) → `performance-engineer` + `media-processing` [параллельно с B]
4. **C** (Shell) → `frontend-developer`
5. **D** (Landing) → `frontend-developer` + `aesthetic`
6. **E** (Catalog) → `frontend-developer` [параллельно с F]
7. **F** (Product) → `frontend-developer` [параллельно с E]
8. **G** (Works) → `frontend-developer` + `ai-multimodal`
9. **I** (QA) → `test-automator` + `code-review`

## Ключевые файлы

### Токены и стили
- `src/app/globals.css` — CSS переменные палитры
- `tailwind.config.ts` — Tailwind mapping
- `src/app/layout.tsx` — Inter font, meta

### UI Kit
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx` → GlassCard
- `src/components/ui/badge.tsx`
- `src/components/ui/input.tsx`

### Layout
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/mobile-nav.tsx`
- `src/components/layout/MobileContactDock.tsx`

### Главная
- `src/components/home/Hero.tsx`
- `src/components/home/TrustStrip.tsx`
- `src/components/home/FeaturedProducts.tsx`
- `src/components/home/Financing.tsx`

## Палитра (утверждённая)

```css
--color-bg-primary: #0a0a0f
--color-bg-secondary: #12121a
--color-bg-card: #1a1a24
--color-accent-primary: #a855f7
--color-accent-secondary: #c084fc
--color-accent-glow: #d946ef
--color-text-primary: #f8fafc
--color-text-secondary: #94a3b8
--color-border-subtle: rgba(168,85,247,0.15)
--color-border-glow: rgba(217,70,239,0.4)
```

## MCP Plugins (активные)

- **Shadcn:** Компоненты UI
- **Context7:** Документация библиотек
- **Serena:** Символьное редактирование + память
- **Playwright:** Визуальные тесты
- **Filesystem:** Работа с ассетами

## Skills (активные)

- `ui-styling` — Tailwind + дизайн
- `frontend-development` — React/Next.js
- `aesthetic` — Дизайн-принципы
- `media-processing` — Оптимизация изображений
- `code-review` — Проверка кода

## Definition of Done

- [ ] LCP моб < 2.5s
- [ ] CLS < 0.02
- [ ] INP < 200ms
- [ ] Keyboard-only nav
- [ ] Reduced motion support
- [ ] JSON-LD на всех страницах

## Changelog

### 2025-12-28
- Создан master plan
- Определены агенты A-I
- Настроены координаторы
- Сохранён начальный контекст
