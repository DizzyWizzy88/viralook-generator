import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Allows popup auth windows (Firebase) to communicate without COOP warnings
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
  },
    // Proxies local /api calls directly to your live Render backend during dev
    proxy: {
      '/api': {
        target: 'https://viralook-generator-2.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});