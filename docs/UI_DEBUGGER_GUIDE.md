# UI Debugger - Руководство по использованию

## Что было сделано

Создана система мониторинга UI в реальном времени, которая отслеживает:

1. **Изображения** - загрузка, ошибки, время загрузки
2. **CSS анимации** - начало, конец, длительность
3. **CSS переходы** - transition events
4. **Framer Motion анимации** - через специальные компоненты
5. **Layout Shifts (CLS)** - сдвиги макета
6. **Paint Timing** - FCP, LCP метрики

## Как это работает

### Автоматический мониторинг

Система уже интегрирована в `layout.tsx` и работает автоматически:

```tsx
// В src/app/layout.tsx
<UIMonitor enabled={true} />
```

Все события логируются в:
```
.cursor/debug.log
```

### Что мониторится автоматически

✅ Все изображения через компонент `OptimizedImage`
✅ Все CSS анимации на странице
✅ Все CSS переходы (transitions)
✅ Layout shifts (CLS)
✅ Paint timing метрики

## Просмотр логов

### Формат логов

Логи записываются в формате NDJSON (один JSON объект на строку):

```json
{
  "location": "useUIMonitor:monitorImage",
  "message": "Image success",
  "data": {
    "src": "/images/product.jpg",
    "status": "success",
    "loadTime": 234
  },
  "timestamp": 1733456789000,
  "sessionId": "ui-monitor",
  "hypothesisId": "H1"
}
```

### Категории событий (hypothesisId)

- **H1** - Проблемы с изображениями
- **H2** - Проблемы с анимациями
- **H3** - Layout shifts
- **H4** - Изменения видимости страницы
- **H5** - Paint timing

## Использование в коде

### Мониторинг изображений

Компонент `OptimizedImage` уже интегрирован:

```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  preset="card"
/>
```

### Мониторинг Framer Motion

Используйте хук или компонент:

```tsx
// Вариант 1: Хук
import { useFramerMotionMonitor } from '@/components/ui/FramerMotionMonitor';

const { onAnimationStart, onAnimationComplete } = useFramerMotionMonitor('my-animation');

<motion.div
  onAnimationStart={onAnimationStart}
  onAnimationComplete={onAnimationComplete}
>
  Content
</motion.div>

// Вариант 2: Компонент
import { MonitoredMotionDiv } from '@/components/ui/FramerMotionMonitor';

<MonitoredMotionDiv animationName="fade-in">
  Content
</MonitoredMotionDiv>
```

## Отключение мониторинга

### Глобально

В `layout.tsx`:
```tsx
<UIMonitor enabled={false} />
```

### В конкретном компоненте

```tsx
const monitor = useUIMonitor(false);
```

## Анализ проблем

### Проблемы с изображениями (H1)

Ищите в логах события с `hypothesisId: "H1"`:

```bash
# Найти все проблемы с изображениями
grep '"hypothesisId":"H1"' .cursor/debug.log

# Найти только ошибки загрузки
grep '"status":"error"' .cursor/debug.log
```

### Проблемы с анимациями (H2)

Ищите события с `hypothesisId: "H2"`:

```bash
# Найти все анимации
grep '"hypothesisId":"H2"' .cursor/debug.log

# Найти анимации, которые не завершились
grep '"status":"start"' .cursor/debug.log | grep -v '"status":"end"'
```

### Layout Shifts (H3)

Ищите события с `hypothesisId: "H3"`:

```bash
# Найти все layout shifts
grep '"hypothesisId":"H3"' .cursor/debug.log

# Найти большие сдвиги (>0.1)
grep '"value":0\.[1-9]' .cursor/debug.log
```

## Примеры использования

### Отладка медленной загрузки изображений

1. Откройте сайт
2. Проверьте логи:
```bash
cat .cursor/debug.log | grep '"loadTime"' | sort -t: -k2 -n
```

### Отладка проблем с анимациями

1. Воспроизведите проблему
2. Проверьте логи:
```bash
cat .cursor/debug.log | grep '"hypothesisId":"H2"'
```

### Отладка Layout Shifts

1. Прокрутите страницу
2. Проверьте логи:
```bash
cat .cursor/debug.log | grep '"hypothesisId":"H3"'
```

## Производительность

Мониторинг выполняется асинхронно и не влияет на производительность:
- Все логи отправляются через `fetch` с обработкой ошибок
- События не блокируют основной поток
- Можно безопасно оставить включенным в production

## Расширение

Чтобы добавить новый тип мониторинга, см. `docs/UI_MONITORING.md`
