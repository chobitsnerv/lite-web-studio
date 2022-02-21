import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import App from "@/App.vue";
import FloatingVue from "floating-vue";
import AudioLists from "globals/audio_lists.js";
import FilterOptions from "globals/filter_options.js";
import Variables from "globals/variables.js";
import Consts from "globals/consts.js";
import utils from "utils/utils.js";
import eventBus from "vue3-eventbus";
import "floating-vue/dist/style.css";

// 从localStorage读取喜爱列表
AudioLists.love_list = utils.readLoveList();
//初始化一些基础项目
AudioLists.playlist.push(Consts.empty_song);
AudioLists.cutter_list = Consts.cutter_list;
Variables.use_treated = { value: utils.readSettings().use_treated };

window.AudioLists = AudioLists;
window.FilterOptions = FilterOptions;
window.Variables = Variables;

if ("serviceWorker" in navigator) {
  registerSW();
}

const app = createApp(App);
app.use(FloatingVue, {
  themes: {
    tooltip: {
      delay: {
        show: 50,
        hide: 100,
      },
    },
  },
});
app.use(eventBus);
app.mount("#app");
