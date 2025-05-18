/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: [
        'assets/icon/StorageFS-64.png',
        'assets/icon/StorageFS-512.png'
      ],
      manifest: {
        name: 'StorageFS',
        short_name: 'StorageFS',
        description: 'Storage Management System',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/assets/icon/StorageFS-64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/assets/icon/StorageFS-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/icon/StorageFS-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/assets/icon/StorageFS-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      strategies: 'injectManifest',
      filename: 'sw.js',
      injectRegister: 'auto',
      minify: true,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        cleanupOutdatedCaches: true,
        sourcemap: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@capacitor/camera': path.resolve(__dirname, 'node_modules/@capacitor/camera')
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    exclude: []
  },
  define: {
    'process.env': process.env
  }
})
