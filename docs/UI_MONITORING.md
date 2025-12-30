# UI Monitoring System

Система мониторинга UI в реальном времени для отслеживания изображений и анимаций.

## Что мониторится

### 1. Изображения
- ✅ Статус загрузки (loading, success, error)
- ✅ Время загрузки (loadTime)
- ✅ Размеры изображения (naturalWidth, naturalHeight)
- ✅ Компонент, использующий изображение
- ✅ URL источника

### 2. CSS Анимации
- ✅ Начало анимации (animationstart)
- ✅ Конец анимации (animationend)
- ✅ Длительность анимации
- ✅ Имя анимации
- ✅ Элемент, на котором выполняется анимация

### 3. CSS Переходы (Transitions)
- ✅ Начало перехода (transitionstart)
- ✅ Конец перехода (transitionend)
- ✅ Свойство, которое анимируется
- ✅ Длительность перехода

### 4. Framer Motion Анимации
- ✅ Начало анимации
- ✅ Конец анимации
- ✅ Длительность
- ✅ Имя анимации

### 5. Layout Shifts (CLS)
- ✅ Значение сдвига
- ✅ Источники сдвига (элементы, которые вызвали сдвиг)
- ✅ Координаты до и после сдвига

### 6. Paint Timing
- ✅ First Contentful Paint (FCP)
- ✅ Largest Contentful Paint (LCP)

## Как использовать

### Автоматический мониторинг

Система уже интегрирована в `layout.tsx` и автоматически мониторит:
- Все изображения через `OptimizedImage` компонент
- Все CSS анимации и переходы
- Layout shifts
- Paint timing метрики

### Ручной мониторинг

#### Мониторинг изображений

Компонент `OptimizedImage` уже интегрирован с системой мониторинга:

```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  preset="card"
/>
```

#### Мониторинг Framer Motion анимаций

Используйте хук `useFramerMotionMonitor`:

```tsx
import { motion } from 'framer-motion';
import { useFramerMotionMonitor } from '@/components/ui/FramerMotionMonitor';

function MyComponent() {
  const { onAnimationStart, onAnimationComplete } = useFramerMotionMonitor('my-animation');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
    >
      Content
    </motion.div>
  );
}
```

Или используйте компонент `MonitoredMotionDiv`:

```tsx
import { MonitoredMotionDiv } from '@/components/ui/FramerMotionMonitor';

<MonitoredMotionDiv
  animationName="fade-in"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</MonitoredMotionDiv>
```

## Просмотр логов

Все события логируются в файл:
```
.cursor/debug.log
```

Формат логов: NDJSON (один JSON объект на строку)

### Примеры логов

**Загрузка изображения:**
```json
{
  "location": "useUIMonitor:monitorImage",
  "message": "Image success",
  "data": {
    "src": "/images/product.jpg",
    "alt": "Product image",
    "status": "success",
    "loadTime": 234,
    "naturalWidth": 800,
    "naturalHeight": 600,
    "componentName": "OptimizedImage"
  },
  "timestamp": 1733456789000,
  "sessionId": "ui-monitor",
  "hypothesisId": "H1"
}
```

**CSS анимация:**
```json
{
  "location": "useUIMonitor:monitorAnimation",
  "message": "Animation end: fade-in",
  "data": {
    "type": "css",
    "name": "fade-in",
    "status": "end",
    "duration": 500,
    "element": "div"
  },
  "timestamp": 1733456789000,
  "sessionId": "ui-monitor",
  "hypothesisId": "H2"
}
```

**Layout Shift:**
```json
{
  "location": "useUIMonitor:layout-shift",
  "message": "Layout shift detected",
  "data": {
    "value": 0.15,
    "cumulativeValue": 0.25,
    "sources": [
      {
        "node": "IMG",
        "previousRect": { "x": 0, "y": 0, "width": 0, "height": 0 },
        "currentRect": { "x": 0, "y": 0, "width": 800, "height": 600 }
      }
    ]
  },
  "timestamp": 1733456789000,
  "sessionId": "ui-monitor",
  "hypothesisId": "H3"
}
```

## Отключение мониторинга

Чтобы отключить мониторинг, установите `enabled={false}` в `UIMonitor`:

```tsx
<UIMonitor enabled={false} />
```

Или отключите в конкретном компоненте:

```tsx
const { trackImageLoadStart } = useUIMonitor(false);
```

## Гипотезы для отладки

Система использует следующие hypothesisId для категоризации:

- **H1**: Проблемы с загрузкой изображений
- **H2**: Проблемы с анимациями (CSS и Framer Motion)
- **H3**: Layout shifts (CLS)
- **H4**: Изменения видимости страницы
- **H5**: Paint timing метрики

## Производительность

Мониторинг выполняется асинхронно и не блокирует основной поток. Все логи отправляются через `fetch` с обработкой ошибок, чтобы не влиять на работу приложения.

## Расширение мониторинга

Чтобы добавить новый тип мониторинга:

1. Добавьте новую функцию в `useUIMonitor.ts`
2. Используйте `logEvent` для логирования событий
3. Добавьте обработчики событий в `UIMonitor.tsx`

Пример:

```tsx
// В useUIMonitor.ts
const monitorCustomEvent = useCallback((data: any) => {
  if (!enabled) return;
  logEvent({
    location: 'useUIMonitor:custom',
    message: 'Custom event',
    data,
    hypothesisId: 'H6',
  });
}, [enabled]);
```
