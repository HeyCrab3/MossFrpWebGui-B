// vite.config.js
import { defineConfig } from "file:///I:/MossFrpWebLite/frontend-gui/node_modules/vite/dist/node/index.js";
import vue from "file:///I:/MossFrpWebLite/frontend-gui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///I:/MossFrpWebLite/frontend-gui/node_modules/unplugin-vue-components/dist/vite.mjs";
import { VantResolver } from "file:///I:/MossFrpWebLite/frontend-gui/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var vite_config_default = defineConfig({
  plugins: [vue(), Components({
    resolvers: [VantResolver()]
  })],
  server: {
    proxy: {
      "/api": {
        target: "http://public.ghs.wiki:7001/API",
        changeOrigin: true,
        secure: false,
        headers: {
          Referer: "Unknown"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJJOlxcXFxNb3NzRnJwV2ViTGl0ZVxcXFxmcm9udGVuZC1ndWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkk6XFxcXE1vc3NGcnBXZWJMaXRlXFxcXGZyb250ZW5kLWd1aVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vSTovTW9zc0ZycFdlYkxpdGUvZnJvbnRlbmQtZ3VpL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpLENvbXBvbmVudHMoe1xuICAgIHJlc29sdmVyczogW1ZhbnRSZXNvbHZlcigpXSxcbiAgfSldLFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL3B1YmxpYy5naHMud2lraTo3MDAxL0FQSScsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgaGVhZGVyczogeyAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgIFJlZmVyZXI6ICdVbmtub3duJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUixTQUFTLG9CQUFvQjtBQUMvUyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxvQkFBb0I7QUFHN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLElBQUksR0FBRSxXQUFXO0FBQUEsSUFDekIsV0FBVyxDQUFDLGFBQWEsQ0FBQztBQUFBLEVBQzVCLENBQUMsQ0FBQztBQUFBLEVBQ0YsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUztBQUFBLFVBQ1AsU0FBUztBQUFBLFFBQ1g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
