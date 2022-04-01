<script>
import { ref, onMounted } from "vue";
export default {
  name: "App",
};
</script>

<script setup>
import bus from "vue3-eventbus";
import song_data from "utils/data.js";
import utils from "utils/utils.js";
import { i18n } from "i18n/locale.js";
import MainSongList from "components/MainSongList.vue";
import AudioPlayer from "components/AudioPlayer.vue";
import Banner from "components/Banner.vue";
import Footer from "components/Footer.vue";
import FunctionBar from "./components/FunctionBar.vue";
import ImportSongList from "components/ImportSongList.vue";
import InfoPopUp from "popup/Info.vue";
//import Interpolator from "utils/vue-apply-darkmode.esm.js";
import Interpolator from "components/DarkMode.vue";

//debug用变量，由于没响应式需求所以不用ref创建
const develop = false;
const ifDebug = ref(false);
const showInfo = ref(false);
const debugList = window.Variables.debug_list;
const player = ref(null);
const mainsonglist = ref(null);
const isDarkMode = ref(false);
const isAutoMode = ref(false);

const init = () => {
  // 获取歌曲
  song_data
    .getSongData()
    .then(() => {
      // 加入保存的播放列表
      let _local_playlist = utils.readPlaylist();
      player.value.playlistReplace(
        _local_playlist.song_list,
        _local_playlist.current_song
      );
      player.value.playMode = utils.readSettings().play_mode;
      player.value.volume = utils.readSettings().play_volume;
      // 如果有查询参数就把这首歌加入播放列表
      const parsedUrl = new URL(window.location.href);
      let query = parsedUrl.searchParams.get("s");
      if (query !== null && query !== "") {
        let song_idx = window.AudioLists.song_list.findIndex(
          (s) => s.has_audio && s.id === query
        );
        if (song_idx !== -1)
          player.value.playlistAddSong(
            window.AudioLists.song_list[song_idx],
            true
          );
        // 清空地址栏的查询参数
        window.history.replaceState({}, "", window.location.pathname);
      }
      // 看看是不是首次打开
      if (utils.checkFirstBrowse()) {
        // 首次打开就播放推荐曲
        showInfo.value = true;
        // 光 逆光 我的偶像宣言 Fansa
        // let recommand_song_list = ["U00044", "U01506", "U00113", "U01500"];
        // let song_list = recommand_song_list.map((i) =>
        //   window.AudioLists.song_list.find((s) => s.id === i)
        // );
        // //console.log(song_list);
        // player.value.playlistAddMany(song_list);
      }
      bus.emit("apply-search-event");
    })
    .catch((e) => console.log(e));
};

const changeNightMode = (mode) => {
  switch (mode) {
    case "dark":
      isDarkMode.value = true;
      isAutoMode.value = false;
      break;
    case "system":
      isDarkMode.value = false;
      isAutoMode.value = true;
      break;
    default:
      isDarkMode.value = false;
      isAutoMode.value = false;
  }
};

onMounted(() => {
  init();
  bus.on("night-mode-change", (para) => {
    changeNightMode(para);
  });
  changeNightMode(utils.readSettings().night_mode);
});
</script>

<template>
  <div id="app">
    <div class="c-outer">
      <Interpolator v-bind:dark="isDarkMode" v-bind:watchSystem="isAutoMode">
        <Banner />
        <input v-show="develop" type="checkbox" v-model="ifDebug" />
        <div v-show="ifDebug">
          <div v-for="(d, idx) in debugList" v-bind:key="d + idx">{{ d }}</div>
        </div>
        <MainSongList ref="mainsonglist" />
        <AudioPlayer ref="player" />
        <FunctionBar />
        <ImportSongList />
        <Footer />
        <InfoPopUp v-if="showInfo" v-on:closepopup="showInfo = false" />
        <div id="spaceholder" />
      </Interpolator>
    </div>
  </div>
</template>

<style>
@import "styles/app.scss";
</style>
