import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const cmsProxyTarget = process.env.CMS_PROXY_TARGET || "http://127.0.0.1:8000";
const frontendPort = Number(process.env.PORT || 8443);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: frontendPort,
    strictPort: true,
    proxy: {
      "/api": {
        target: cmsProxyTarget,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (request) => {
            const frontendOrigin = `http://localhost:${frontendPort}`;
            request.setHeader("Origin", frontendOrigin);
            request.setHeader("Referer", `${frontendOrigin}/`);
          });
        },
      },
      "/sanctum": {
        target: cmsProxyTarget,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (request) => {
            const frontendOrigin = `http://localhost:${frontendPort}`;
            request.setHeader("Origin", frontendOrigin);
            request.setHeader("Referer", `${frontendOrigin}/`);
          });
        },
      },
      "/storage": {
        target: cmsProxyTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: process.env.HOST || "0.0.0.0",
    port: Number(process.env.PORT || 8443),
  },
});
