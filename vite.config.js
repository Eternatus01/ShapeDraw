import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/ShapeDraw/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [],
});
