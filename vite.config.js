import { defineConfig } from "vite";

export default defineConfig({
  base: "",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [],
});
