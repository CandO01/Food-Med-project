import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(), // ✅ Enable React plugin
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'icon/android-chrome-192x192.png',
        'icon/android-chrome-512x512.png'
      ],
      manifest: {
        name: 'FoodMed App',
        short_name: 'FoodMed',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4CAF50',
        icons: [
          {
            src: '/icon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/', // ✅ Set base path for Netlify (use '/repo-name/' if deploying to subpath)
  build: {
    outDir: 'dist', // ✅ Ensure this matches Netlify's "Publish directory"
    assetsDir: 'assets', // (Optional) Organize assets
    emptyOutDir: true, // (Optional) Clear old files on build
  }
});




















// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   base: './', 
// })
