import { createApp } from "vue";
import App from "@/App.vue";
import VTooltip from "floating-vue";
import AudioLists from "globals/audio_lists.js";
import FilterOptions from "globals/filter_options.js";
import Variables from "globals/variables.js";
import Consts from "globals/consts.js";
import utils from "utils/utils.js";
import eventBus from "vue3-eventbus";

// 从localStorage读取喜爱列表
AudioLists.love_list = utils.readLoveList();
//初始化一些基础项目
AudioLists.playlist.push(Consts.empty_song);
AudioLists.cutter_list = Consts.cutter_list;
Variables.use_treated = { value: utils.readSettings().use_treated };

window.AudioLists = AudioLists;
window.FilterOptions = FilterOptions;
window.Variables = Variables;

const app = createApp(App);
app.use(VTooltip);
app.use(eventBus);
app.mount("#app");
