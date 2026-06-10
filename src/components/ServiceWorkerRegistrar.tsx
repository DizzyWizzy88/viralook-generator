"use client";
import { useEffect } from 'react';

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('✅ Viralook System Online:', reg.scope))
        .catch((err) => console.error('❌ System Link Failed:', err));
    }
  }, []);

  return null;
}
