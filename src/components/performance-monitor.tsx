'use client';

import { useEffect } from 'react';

export function PerformanceMonitor() {
  useEffect(() => {
    // Web Vitals monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        // First Contentful Paint (FCP)
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          console.log(`FCP: ${fcp.startTime.toFixed(2)}ms`);
        }

        // Largest Contentful Paint (LCP)
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const delay = entry.processingStart - entry.startTime;
            console.log(`FID: ${delay.toFixed(2)}ms`);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              console.log(`CLS: ${clsValue.toFixed(4)}`);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Time to Interactive (TTI)
        if ('PerformanceObserver' in window) {
          const ttiObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const navEntry = entries.find((entry): entry is PerformanceNavigationTiming => 
              entry.entryType === 'navigation'
            );
            if (navEntry) {
              const tti = navEntry.loadEventEnd - navEntry.fetchStart;
              console.log(`TTI: ${tti.toFixed(2)}ms`);
            }
          });
          ttiObserver.observe({ entryTypes: ['navigation'] });
        }

        // Memory usage (if available)
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          console.log(`Memory Usage: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
        }

        // Cleanup
        return () => {
          observer.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.error('Performance monitoring error:', error);
      }
    }
  }, []);

  return null;
}