/**
 * Frontend performance monitoring utilities
 */

/**
 * Measure and log page load performance
 */
export const measurePageLoad = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      const metrics = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        load: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.navigationStart
      };
      
      // Log slow page loads (> 3 seconds)
      if (metrics.total > 3000) {
        console.warn('Slow page load detected:', metrics);
      }
      
      return metrics;
    }
  }
  
  return null;
};

/**
 * Measure component render performance
 */
export const measureRender = (componentName, renderFn) => {
  const start = performance.now();
  const result = renderFn();
  const end = performance.now();
  const duration = end - start;
  
  // Log slow renders (> 16ms for 60fps)
  if (duration > 16) {
    console.warn(`Slow render detected: ${componentName} - ${duration.toFixed(2)}ms`);
  }
  
  return result;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (img, src) => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.src = src;
          entry.target.classList.remove('lazy');
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(img);
  } else {
    // Fallback for browsers without IntersectionObserver
    img.src = src;
  }
};

/**
 * Preload critical resources
 */
export const preloadResource = (href, as = 'script') => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
};

/**
 * Monitor Core Web Vitals
 */
export const monitorWebVitals = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

/**
 * Performance budget checker
 */
export const checkPerformanceBudget = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    if (navigation) {
      const budgets = {
        totalLoadTime: 3000, // 3 seconds
        domContentLoaded: 1500, // 1.5 seconds
        firstContentfulPaint: 1000 // 1 second
      };
      
      const actual = {
        totalLoadTime: navigation.loadEventEnd - navigation.navigationStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart
      };
      
      // Check if we're within budget
      const results = {};
      Object.keys(budgets).forEach(metric => {
        if (actual[metric]) {
          results[metric] = {
            budget: budgets[metric],
            actual: actual[metric],
            withinBudget: actual[metric] <= budgets[metric]
          };
        }
      });
      
      return results;
    }
  }
  
  return null;
};