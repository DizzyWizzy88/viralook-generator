"use client"; // This marks it as a client component

import { useEffect } from 'react';

export default function ServiceWorkerCheck() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.hostname !== 'localhost'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          //.register('/sw.js')
          //.then((reg) => console.log('SW registered:', reg))
          //.catch((err) => console.log('SW registration failed:', err));
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
