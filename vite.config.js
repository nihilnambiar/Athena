import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:9001',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:9001'),
  },
}) 