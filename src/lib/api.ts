/**
 * src/lib/api.ts
 * Helper to ensure the Android app calls the absolute Vercel URL
 */

const PRODUCTION_URL = 'https://viralook-generator.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

export const getApiUrl = (path: string): string => {
  // Use the Vercel URL if we are building for production (Android App)
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? PRODUCTION_URL 
    : LOCAL_URL;

  // Ensure the path starts with a slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
};
