import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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

    //  {
    //   "@": "./src",
    //   api: path.resolve(__dirname, "src/apis"),
    //   assets: path.resolve(__dirname, "src/assets"),
    //   ui: path.resolve(__dirname, "src/assets/ui"),
    //   components: path.resolve(__dirname, "src/components"),
    //   popup: path.resolve(__dirname, "src/components/popup"),
    //   globals: path.resolve(__dirname, "src/globals"),
    //   styles: path.resolve(__dirname, "src/styles"),
    //   utils: path.resolve(__dirname, "src/utils"),
    // },
  },
  define: {
    BACKDOOR_WORDS: JSON.stringify("ILOVEMEUMY"),
    APP_VERSION: JSON.stringify("0.1"),
    REMOTE_SOURCE_URL: JSON.stringify("0.1"),
  },
});
