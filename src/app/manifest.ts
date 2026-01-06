import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Viralook AI Studio',
    short_name: 'Viralook',
    description: 'The ultimate AI summoning suite for viral creators.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#06b6d4', // Neon Cyan
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
