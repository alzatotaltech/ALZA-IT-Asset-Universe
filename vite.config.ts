import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['alza-logo.png', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'ALZA IT Audit',
        short_name: 'ALZA Audit',
        description: 'Complete physical, asset, telecom, software, security and governance IT audit platform',
        theme_color: '#0d1119',
        background_color: '#0d1119',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
        navigateFallback: 'index.html'
      }
    })
  ]
});
