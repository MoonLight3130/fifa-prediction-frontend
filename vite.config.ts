import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],

  build: {
    // No source maps in production — prevents source code exposure
    sourcemap: false,
    // Warn if any chunk exceeds 600 kB
    chunkSizeWarningLimit: 600,
  },

  // Dev-only proxy — ignored in production builds
  server: {
    proxy:
      mode === 'development'
        ? {
            '/api': {
              target: 'http://localhost:5000',
              changeOrigin: true,
            },
          }
        : undefined,
  },
}))
