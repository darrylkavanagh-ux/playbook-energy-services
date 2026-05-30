import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      // @/ maps to client/src/ — used throughout all client code
      '@': path.resolve(__dirname, 'client/src'),
    },
  },
  // Tell Vite where the root of the SPA is
  root: path.resolve(__dirname, 'client'),
  build: {
    // Output compiled frontend to dist/public/ so the server can serve it
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'client/index.html'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    // Proxy API calls to Express backend in dev
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
})
