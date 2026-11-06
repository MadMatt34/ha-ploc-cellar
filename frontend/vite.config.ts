import { defineConfig } from "vite";

export default defineConfig({
  // ECharts uses process.env.NODE_ENV in development-only guards.
  // Replace it at build time: browser bundles must not depend on Node's process.
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: "src/ploc-cellar-card.ts",
      formats: ["es"],
      fileName: () => "ploc-cellar-card.js",
    },
    outDir: "../custom_components/ploc_cellar/www",
    emptyOutDir: true,
    target: "es2022",
    minify: true,
  },
});
