import { useEffect } from 'react';

export function usePreloadCriticalResources() {
  useEffect(() => {
    // Предзагрузка критических ресурсов
    const preloadLinks = [
      '/fonts/roboto-latin.woff2',
      '/images/logo.webp',
      '/api/category-list',
    ];

    preloadLinks.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';

      if (href.includes('.woff2')) {
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
      } else if (href.includes('.webp') || href.includes('.jpg')) {
        link.as = 'image';
      } else if (href.includes('/api/')) {
        link.as = 'fetch';
        link.crossOrigin = 'anonymous';
      }

      link.href = href;
      document.head.appendChild(link);
    });

    // DNS prefetch для внешних ресурсов
    const dnsPrefetchDomains = [
      'https://2.ugdr97aqcjm.xvest3.ru',
      'https://fonts.googleapis.com',
    ];

    dnsPrefetchDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);
}
