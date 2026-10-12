import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LOKESH - Software Development & Design',
    short_name: 'LOKESH',
    description:
      'Software Development & Design by M. Lokesh. Creating practical, responsive websites and applications.',
    start_url: '/casual',
    display: 'standalone',
    background_color: '#060918',
    theme_color: '#060918',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
