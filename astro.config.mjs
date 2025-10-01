import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import VitePWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://snucko.github.io',
  base: '/lukemagic',
  integrations: [
    tailwind({ applyBaseStyles: true }),
    sitemap(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Luke — Magic',
        short_name: 'Luke',
        start_url: '/',
        display: 'standalone',
        background_color: '#0b0b0f',
        theme_color: '#0b0b0f',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
});
