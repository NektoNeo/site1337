'use client';

/**
 * UI Monitor Hook - stub for compatibility
 */
export const useUIMonitor = (enabled: boolean = false) => {
  return {
    trackImageLoadStart: (src: string) => {},
    trackImageLoadSuccess: (src: string, alt: string, component: string) => {},
    trackImageLoadError: (src: string, alt: string, component: string) => {},
  };
};
