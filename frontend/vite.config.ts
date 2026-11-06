import { defineConfig } from "vite";

export default defineConfig({
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
