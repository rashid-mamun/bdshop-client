import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          motion: ['framer-motion'],
          ui: ['lucide-react', 'react-hook-form', 'zod']
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
})
