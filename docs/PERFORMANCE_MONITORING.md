# Performance Monitoring Guide

A lightweight, browser-native performance monitoring system for the VA-PC Next.js e-commerce site.
No external services required - uses built-in browser Performance APIs.

## Quick Start

The performance monitoring system is automatically initialized when the app loads. In development mode:

1. **View Performance Dashboard**: Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to toggle the visual dashboard
2. **View Console Report**: Performance metrics are automatically logged to the console every 10 seconds
3. **Manual Report**: Call `performanceMonitor.reportToConsole()` in the browser console

## Architecture

```
src/
├── lib/
│   └── performance-monitoring.ts     # Core monitoring utilities
├── components/
│   ├── ui/
│   │   ├── UIMonitor.tsx             # Global monitoring component
│   │   └── PerformanceDashboard.tsx  # Visual dashboard overlay (dev only)
│   └── error/
│       └── PerformanceErrorBoundary.tsx  # Error boundary with perf tracking
└── app/
    └── layout.tsx                    # Integration point
```

## Features

### 1. Core Web Vitals Tracking

The system automatically tracks all Core Web Vitals using native PerformanceObserver API:

| Metric | Description | Good | Needs Improvement | Poor |
|--------|-------------|------|-------------------|------|
| **LCP** | Largest Contentful Paint (loading) | <= 2.5s | <= 4s | > 4s |
| **FID** | First Input Delay (interactivity) | <= 100ms | <= 300ms | > 300ms |
| **CLS** | Cumulative Layout Shift (stability) | <= 0.1 | <= 0.25 | > 0.25 |
| **INP** | Interaction to Next Paint (responsiveness) | <= 200ms | <= 500ms | > 500ms |
| **FCP** | First Contentful Paint (initial render) | <= 1.8s | <= 3s | > 3s |
| **TTFB** | Time to First Byte (server response) | <= 800ms | <= 1.8s | > 1.8s |

### 2. Custom Performance Marks

Track custom operations with performance marks:

```typescript
import { performanceMonitor } from '@/lib/performance-monitoring';

// Mark the start of an operation
performanceMonitor.mark('data-fetch-start');

// ... perform operation ...

// Measure the duration
const duration = performanceMonitor.measure('data-fetch', 'data-fetch-start');
console.log(`Data fetch took ${duration}ms`);
```

### 3. React Hook Integration

Use the `usePerformanceMonitor` hook in React components:

```typescript
import { usePerformanceMonitor } from '@/lib/performance-monitoring';

function MyComponent() {
  const { mark, measure, addMetric, score, webVitals } = usePerformanceMonitor();

  useEffect(() => {
    mark('component-init');
    // ... initialization logic ...
    measure('component-init-time', 'component-init');
  }, [mark, measure]);

  return (
    <div>
      Performance Score: {score}/100
    </div>
  );
}
```

### 4. Async Operation Tracking

Track async operations easily:

```typescript
import { trackAsyncOperation } from '@/lib/performance-monitoring';

// Automatically tracks start and end time
const data = await trackAsyncOperation('api-call', async () => {
  const response = await fetch('/api/products');
  return response.json();
});
```

### 5. Component Render Tracking

Track component render times:

```typescript
import { trackComponentRender } from '@/lib/performance-monitoring';

function ExpensiveComponent() {
  const { onRenderStart, onRenderEnd } = trackComponentRender('ExpensiveComponent');

  useEffect(() => {
    onRenderStart();
    return () => onRenderEnd();
  }, []);

  return <div>...</div>;
}
```

## Console Output

In development mode, the system outputs formatted performance reports:

```
Performance Report
├── Core Web Vitals
│   ├── LCP: 1234ms (good)
│   ├── FID: 45ms (good)
│   ├── CLS: 0.05 (good)
│   ├── INP: 120ms (good)
│   ├── FCP: 890ms (good)
│   └── TTFB: 234ms (good)
├── Performance Score: 95/100
├── Navigation Timing
│   ├── DNS Lookup: 12ms
│   ├── TCP Connection: 23ms
│   ├── TTFB: 234ms
│   ├── DOM Interactive: 456ms
│   └── Load Complete: 1234ms
└── Custom Metrics (last 10)
    ├── data-fetch: 345ms
    └── component-render: 12ms
```

## Performance Dashboard

The visual dashboard (dev only) shows:

- **Performance Score**: 0-100 overall score based on weighted Web Vitals
- **Core Web Vitals**: Color-coded metrics with ratings
- **Navigation Timing**: Visual breakdown of page load phases
- **Custom Metrics**: Recent custom measurements

Toggle with `Ctrl+Shift+P` / `Cmd+Shift+P`

## Error Boundary

The `PerformanceErrorBoundary` captures:

- Time from page load to error
- Performance score at time of error
- Web Vitals at time of error
- Memory usage (if available)
- Component stack trace

```typescript
// In layout.tsx
<PerformanceErrorBoundary
  onError={(error, errorInfo, performanceData) => {
    // Custom error handling with performance context
    console.log('Error occurred after', performanceData.timeToError, 'ms');
    console.log('Performance score was', performanceData.performanceScore);
  }}
>
  <App />
</PerformanceErrorBoundary>
```

## UIMonitor Features

The `UIMonitor` component tracks:

- **Image Loading**: Load times, errors, and failed images
- **CSS Transitions**: Long transitions (>300ms) that may cause jank
- **Long Tasks**: Main thread blocking (>50ms)
- **Slow Resources**: Resources taking >1s to load
- **Visibility Changes**: When user leaves/returns to page

## API Reference

### performanceMonitor (Singleton)

```typescript
// Initialize monitoring (called automatically)
performanceMonitor.init();

// Create a performance mark
performanceMonitor.mark(name: string);

// Measure between marks (or from mark to now)
performanceMonitor.measure(name: string, startMark: string, endMark?: string): number | null;

// Add a custom metric
performanceMonitor.addCustomMetric(name: string, value: number, unit: 'ms' | 'score' | 'count' | 'bytes');

// Get current snapshot
const snapshot = performanceMonitor.getSnapshot();

// Get performance score (0-100)
const score = performanceMonitor.calculateScore();

// Get specific Web Vital
const lcp = performanceMonitor.getWebVital('LCP');

// Report to console
performanceMonitor.reportToConsole();

// Subscribe to updates
const unsubscribe = performanceMonitor.subscribe((snapshot) => {
  console.log('Metrics updated:', snapshot);
});

// Clear all metrics
performanceMonitor.clear();

// Cleanup
performanceMonitor.destroy();
```

### WebVitalsMetric Type

```typescript
interface WebVitalsMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP' | 'FCP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
  timestamp: number;
}
```

### PerformanceSnapshot Type

```typescript
interface PerformanceSnapshot {
  webVitals: Record<string, WebVitalsMetric>;
  customMetrics: CustomMetric[];
  navigationTiming: NavigationTimingData | null;
  resourceTiming: ResourceTimingData[];
  score: number;
  timestamp: number;
}
```

## Best Practices

1. **Mark Critical Paths**: Add marks around important operations
   ```typescript
   performanceMonitor.mark('checkout-start');
   // ... checkout logic ...
   performanceMonitor.measure('checkout-flow', 'checkout-start');
   ```

2. **Track API Calls**: Use `trackAsyncOperation` for API requests
   ```typescript
   const products = await trackAsyncOperation('fetch-products', fetchProducts);
   ```

3. **Monitor Component Renders**: Track expensive component renders
   ```typescript
   const { onRenderStart, onRenderEnd } = trackComponentRender('ProductGallery');
   ```

4. **Review Metrics Regularly**: Check the console output during development

5. **Set Performance Budgets**: Monitor scores and set alerts for degradation

## Troubleshooting

### Dashboard not appearing
- Ensure you're in development mode (`NODE_ENV=development`)
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)

### Metrics not collecting
- Check browser console for errors
- Verify PerformanceObserver support in your browser
- Ensure `performanceMonitor.init()` is called (automatic in UIMonitor)

### High CLS values
- Check for images without dimensions
- Avoid inserting content above existing content
- Use CSS contain where appropriate

### Poor LCP
- Optimize hero images with preloading
- Reduce server response time (TTFB)
- Minimize render-blocking resources

## Files Reference

| File | Purpose |
|------|---------|
| `src/lib/performance-monitoring.ts` | Core monitoring utilities and React hook |
| `src/components/ui/UIMonitor.tsx` | Global monitoring component (invisible) |
| `src/components/ui/PerformanceDashboard.tsx` | Visual dashboard overlay |
| `src/components/error/PerformanceErrorBoundary.tsx` | Error boundary with perf tracking |
| `src/app/layout.tsx` | Integration point for all monitoring |
