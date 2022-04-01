import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";
import ViteRadar from "vite-plugin-radar";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    visualizer(),
    viteCompression(),
    chunkSplitPlugin(),
    ViteRadar({
      // Google Analytics tag injection
      analytics: [
        {
          id: "G-EKWV7Q91WM",
          // studio.asf.ink
        },
        {
          id: "G-LTKGP0Z3WC",
          // studio.a-soul.fans
        },
        // gtm:  [{
        //     id: 'GTM-595VN9V',
        // },]
      ],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/remoteorign": {
        target:
          "https://as-archive-load-balance.kzmidc.workers.dev/Normalized%20Audio%20New/",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/remoteorign/, ""),
      },
      "/remotetuned": {
        target:
          "https://as-archive-load-balance.kzmidc.workers.dev/Normalized%20Audio%20New/%E4%BF%AE%E5%A4%8D%E6%96%87%E7%89%A9",
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
      {
        find: "assets",
        replacement: path.resolve(__dirname, "./src/assets"),
      },
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
      { find: "i18n", replacement: path.resolve(__dirname, "./src/i18n") },
      { find: "styles", replacement: path.resolve(__dirname, "./src/styles") },
      { find: "utils", replacement: path.resolve(__dirname, "./src/utils") },
    ],
  },
  define: {
    BACKDOOR_WORDS: JSON.stringify("ASOULMEMORY"),
    APP_VERSION: JSON.stringify("1.1"),
    REMOTE_SOURCE_URL: JSON.stringify("0.1"),
    MOST_N: 10,
    AVAILABLE_DAYS_LIMIT: 3,
    CUTTER_DISPLAY_MAX: 5,
    SONGNAME_CONTAIN_VERSION: true,
    SONG_NAME_SOURCE_MODE: true,
    AUDIO_DURATION_IN_MS: true,
    DL_CDN_ON: true,
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
});
