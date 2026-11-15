import { defineConfig } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { definitionImages } from "./src/definition-images.js";

export default defineConfig({
  plugins: [
    definitionImages(),
    ViteImageOptimizer({
      includePublic: true,
      logStats: true,
      cache: true,
      cacheLocation: ".vite-image-cache",
      png: {
        quality: 75,
        palette: true,
        colours: 256,
        compressionLevel: 9,
        adaptiveFiltering: true,
        effort: 10,
      },
      jpeg: {
        quality: 70,
        progressive: true,
        mozjpeg: true,
      },
      jpg: {
        quality: 70,
        progressive: true,
        mozjpeg: true,
      },
    }),
  ],
});
