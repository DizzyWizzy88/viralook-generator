"use client";

import { useEffect } from 'react';

/**
 * ServiceWorkerCheck: 
 * This component handles the "cleanup" of PWA features that clash with Capacitor.
 * It forces any existing Service Workers to unregister and clears the cache.
 */
export default function ServiceWorkerCheck() {
  useEffect(() => {
    // Only run this in the browser (client-side)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      
      // 1. Find all active Service Worker registrations
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          // 2. Force them to unregister immediately
          registration.unregister().then((success) => {
            if (success) {
              console.log('🚫 [Capacitor Fix] Ghost Service Worker Unregistered');
            }
          });
        }
      });

      // 3. Clear the Cache Storage to ensure the WebView isn't 
      //    serving old, broken versions of your login page.
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (let name of names) {
            caches.delete(name).then(() => {
              console.log('🧹 [Capacitor Fix] App Cache Cleared');
            });
          }
        });
      }
    }
  }, []);

  // This component is purely logic; it doesn't need to render anything to the screen.
  return null;
}