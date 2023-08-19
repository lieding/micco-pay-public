import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import pxtovw from "postcss-px-to-viewport";
import path from "path";

const loder_pxtovw = pxtovw({
  // here is the width of prototypr, we could modify by need
  viewportWidth: 375,
  viewportUnit: "vw",
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: {
      plugins: [loder_pxtovw],
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";',
      },
    },
  },
});
