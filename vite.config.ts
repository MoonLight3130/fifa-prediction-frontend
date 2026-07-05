import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // In dev, proxy /api to the local backend by default.
  // Set VITE_API_URL in .env.local to skip proxy and hit Render directly.
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:5000'

  return {
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
                target: proxyTarget,
                changeOrigin: true,
              },
            }
          : undefined,
    },
  }
})

