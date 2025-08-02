import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Different port from main app
    host: true
  },
  preview: {
    port: process.env.PORT || 4173,
    host: '0.0.0.0',
    allowedHosts: [
      'tagoring.onrender.com',
      'localhost',
      '127.0.0.1',
      '.onrender.com'
    ]
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
