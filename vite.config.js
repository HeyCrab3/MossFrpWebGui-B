import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: 'http://public.ghs.wiki:7001/API',
        changeOrigin: true,
        secure: false,
        headers: {                  
          Referer: 'Unknown'
        }
      }
    }
  }
})
