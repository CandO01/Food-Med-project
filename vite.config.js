import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(), // React plugin (required)
    VitePWA({
      registerType: 'autoUpdate', // Auto-update SW in production
      strategies: 'generateSW', // Explicit SW generation
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
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'], // Cached file types
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB max file size
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, // Example: Cache Google Fonts
            handler: 'CacheFirst'
          }
        ]
      }
    })
  ],
  base: '/', // Ensure correct asset paths in production
  build: {
    outDir: 'dist', // Match Netlify's publish directory
    chunkSizeWarningLimit: 1000, // Silence large chunk warnings (adjust as needed)
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'; // Split dependencies into separate chunk
          }
        }
      }
    }
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
