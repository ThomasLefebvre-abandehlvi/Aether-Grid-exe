import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['neondepicon.jpg'],
        manifest: {
          id: '/',
          name: 'Aether Grid',
          short_name: 'AetherGrid',
          description: 'Explore 5 alien planets, mine crystals, trade in cosmic outposts, and discover alien civilizations.',
          theme_color: '#030308',
          background_color: '#030308',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
  { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
  { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,mp3,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 35 * 1024 * 1024,
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

