import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), electron({
    main: {
      // 配置 Electron 入口文件
      entry: "electron/index.ts"
    }
  }), electronRender()],
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
