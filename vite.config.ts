import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/weather-app/",
  plugins: [
    {
      name: "rewrite-all",
      configureServer(server) {
        server.middlewares.use((req, _, next) => {
          if (!req.url?.startsWith("/weather-app") && !req.url?.includes(".")) {
            req.url = "/weather-app/index.html";
          }
          next();
        });
      },
    },
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer()
          ),
        ]
      : []),
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "client/src") },
      {
        find: "@hooks",
        replacement: path.resolve(__dirname, "client/src/hooks"),
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "client/src/components"),
      },
      { find: "@lib", replacement: path.resolve(__dirname, "client/src/lib") },
      { find: "@shared", replacement: path.resolve(__dirname, "shared") },
      {
        find: "@assets",
        replacement: path.resolve(__dirname, "attached_assets"),
      },
    ],
  },
  publicDir: "public", // Важно!
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    copyPublicDir: true,
    rollupOptions: {
     input: path.resolve(__dirname, "client", "index.html")
    },
  },
});
