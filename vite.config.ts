import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const certificatePath = env.VITE_DEV_HTTPS_CERT?.trim();
  const privateKeyPath = env.VITE_DEV_HTTPS_KEY?.trim();

  if (Boolean(certificatePath) !== Boolean(privateKeyPath)) {
    throw new Error("Set both VITE_DEV_HTTPS_CERT and VITE_DEV_HTTPS_KEY to enable HTTPS.");
  }

  const https = certificatePath && privateKeyPath
    ? {
        cert: readFileSync(certificatePath),
        key: readFileSync(privateKeyPath),
      }
    : undefined;
  const cmsProxyTarget = env.CMS_PROXY_TARGET || "http://127.0.0.1:8000";
  const frontendPort = Number(env.PORT || 8443);
  const frontendOrigin = `${https ? "https" : "http"}://localhost:${frontendPort}`;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: env.HOST || "0.0.0.0",
      port: frontendPort,
      strictPort: true,
      https,
      proxy: {
        "/api": {
          target: cmsProxyTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on("proxyReq", (request) => {
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
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-dom") || id.includes("react-router") || id.includes("/react/")) {
                return "vendor-react";
              }
              if (id.includes("framer-motion")) {
                return "vendor-framer";
              }
              if (id.includes("gsap") || id.includes("@gsap")) {
                return "vendor-gsap";
              }
              if (id.includes("lucide-react")) {
                return "vendor-lucide";
              }
            }
          },
        },
      },
    },
    preview: {
      host: env.HOST || "0.0.0.0",
      port: Number(env.PORT || 8443),
      https,
    },
  };
});
