import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Proxy to local backend if explicitly enabled, otherwise default to healthy live Render backend
  const backendTarget = env.VITE_BACKEND_URL || (env.VITE_LOCAL_BACKEND === 'true' ? 'http://localhost:5000' : 'https://cinebook-backend-as00.onrender.com')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: backendTarget,
          changeOrigin: true,
          ws: true,
        }
      }
    }
  }
})
