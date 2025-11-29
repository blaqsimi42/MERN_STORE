import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss()],
  server: {
    proxy: {
      "/api/": "http://localhost:5000",
      "/uploads/": "http://localhost:5000",
    },
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  base: mode === "production" ? "/" : "/",
}));
