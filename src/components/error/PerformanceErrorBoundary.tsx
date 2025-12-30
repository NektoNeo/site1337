'use client';

import React from 'react';

interface PerformanceErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface PerformanceErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Lightweight Error Boundary used at the app root to prevent a full white-screen
 * on unexpected runtime/render errors.
 */
export class PerformanceErrorBoundary extends React.Component<
  PerformanceErrorBoundaryProps,
  PerformanceErrorBoundaryState
> {
  state: PerformanceErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): PerformanceErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep logging minimal; callers already have global error handlers in layout.
    // This boundary is primarily to preserve UX.
    // eslint-disable-next-line no-console
    console.error('[PerformanceErrorBoundary]', error, info);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-lg w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <h2 className="text-lg font-semibold text-white">
              Что‑то пошло не так
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Произошла ошибка при рендеринге интерфейса. Попробуйте обновить
              страницу.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 text-left text-xs text-red-200/80 whitespace-pre-wrap break-words bg-black/40 border border-red-500/20 rounded-xl p-3">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-5 inline-flex items-center justify-center rounded-xl px-4 py-2 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-100 font-semibold transition-colors"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

