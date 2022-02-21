import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "AS Studio",
        short_name: "AS",
        description: "lite studio for A-SOUL",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 15000000,
        globPatterns: ["**/*.{html,json,js,css,mp4}"],
        runtimeCaching: [
          {
            urlPattern: /\/datasheets\/.*\/*.csv/, // 接口缓存 此处填你想缓存的接口正则匹配
            handler: "CacheFirst",
            options: {
              cacheName: "csvdb-cache",
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
            handler: "CacheFirst",
            options: {
              cacheName: "image-vedio-cache",
            },
          },
          {
            urlPattern: /^https:\/\/asoul1\.asoul-rec\.com\/.*/i, // 歌曲缓存
            handler: "CacheFirst",
            options: {
              cacheName: "song-url-cache",
            },
          },
          {
            urlPattern: /^https:\/\/mknaifen-my\.sharepoint\.com\/.*/i, // 歌曲缓存
            handler: "CacheFirst",
            options: {
              cacheName: "song-media-cache",
            },
          },
        ],
      },
    }),
  ],
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
    //音频资源前后缀配置
    PREFIX_ORIGN: JSON.stringify(
      "https://asoul1.asoul-rec.com/%E6%AD%8C%E8%88%9E%E5%88%87%E7%89%87/MP3%E7%9B%B4%E6%92%AD%E6%AD%8C%E6%9B%B2%E5%88%87%E7%89%87/"
    ),
    SUFFIX_ORIGN: JSON.stringify(".mp3?raw"),
    PREFIX_TUNED: JSON.stringify(
      "https://asoul1.asoul-rec.com/%E6%AD%8C%E8%88%9E%E5%88%87%E7%89%87/MP3%E7%9B%B4%E6%92%AD%E6%AD%8C%E6%9B%B2%E5%88%87%E7%89%87/%E4%BF%AE%E5%A4%8D%E6%96%87%E7%89%A9/"
    ),
    SUFFIX_TUNED: JSON.stringify(".mp3?raw"),
    MOST_N: 5,
    AVAILABLE_DAYS_LIMIT: 5,
    CUTTER_DISPLAY_MAX: 5,
    SONGNAME_CONTAIN_VERSION: true,
    SONG_NAME_SOURCE_MODE: true,
    AUDIO_DURATION_IN_MS: true,
  },
});
