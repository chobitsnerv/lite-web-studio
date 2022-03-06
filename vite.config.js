import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), visualizer()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/remoteorign": {
        target:
          "https://asoul1.asoul-rec.com/%E6%AD%8C%E8%88%9E%E5%88%87%E7%89%87/MP3%E7%9B%B4%E6%92%AD%E6%AD%8C%E6%9B%B2%E5%88%87%E7%89%87",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/remoteorign/, ""),
      },
      "/remotetuned": {
        target:
          "https://asoul1.asoul-rec.com/%E6%AD%8C%E8%88%9E%E5%88%87%E7%89%87/MP3%E7%9B%B4%E6%92%AD%E6%AD%8C%E6%9B%B2%E5%88%87%E7%89%87/%E4%BF%AE%E5%A4%8D%E6%96%87%E7%89%A9",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/remotetuned/, ""),
      },
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: "apis", replacement: path.resolve(__dirname, "./src/apis") },
      { find: "assets", replacement: path.resolve(__dirname, "./src/assets") },
      { find: "ui", replacement: path.resolve(__dirname, "./src/assets/ui") },
      {
        find: "components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        find: "popup",
        replacement: path.resolve(__dirname, "./src/components/popup"),
      },
      {
        find: "globals",
        replacement: path.resolve(__dirname, "./src/globals"),
      },
      { find: "styles", replacement: path.resolve(__dirname, "./src/styles") },
      { find: "utils", replacement: path.resolve(__dirname, "./src/utils") },
    ],
  },
  define: {
    BACKDOOR_WORDS: JSON.stringify("ASOULMEMORY"),
    APP_VERSION: JSON.stringify("0.1"),
    REMOTE_SOURCE_URL: JSON.stringify("0.1"),
    MOST_N: 10,
    AVAILABLE_DAYS_LIMIT: 15,
    CUTTER_DISPLAY_MAX: 5,
    SONGNAME_CONTAIN_VERSION: true,
    SONG_NAME_SOURCE_MODE: true,
    AUDIO_DURATION_IN_MS: true,
    DL_CDN_ON: true,
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
