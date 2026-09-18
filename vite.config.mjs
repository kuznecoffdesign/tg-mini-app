import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        cases: resolve(process.cwd(), "cases/index.html"),
        caseStudy: resolve(process.cwd(), "cases/sever-supply/index.html"),
        service: resolve(process.cwd(), "services/telegram-commerce/index.html"),
        contact: resolve(process.cwd(), "contact/index.html"),
        privacy: resolve(process.cwd(), "privacy/index.html"),
        notFound: resolve(process.cwd(), "404.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
