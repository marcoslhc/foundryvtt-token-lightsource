import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "scripts/main.js"
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "module.json", dest: "." },
        { src: "styles/*.css", dest: "styles", flatten: true },
        { src: "lang/*.json", dest: "lang", flatten: true }
      ]
    })
  ]
});
