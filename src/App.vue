<script>
export default {
  name: "App",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import song_data from "utils/data.js";
import utils from "utils/utils.js";
import MainSongList from "components/MainSongList.vue";
import AudioPlayer from "components/AudioPlayer.vue";
import Footer from "components/Footer.vue";
import InfoPopUp from "popup/Info.vue";

//debug用变量，由于没响应式需求所以不用ref创建
const develop = false;
const ifDebug = false;
const showInfo = ref(false);
const debugList = window.Variables.debug_list;
const player = ref(null);
const mainsonglist = ref(null);

const init = () => {
  // 看看是不是开了后门
  const parsedUrl = new URL(window.location.href);
  let backdoor_query = parsedUrl.searchParams.get("backdoor");
  if (backdoor_query === BACKDOOR_WORDS) window.Variables.backdoor = true;
  // 获取歌曲
  song_data
    .get_song_data()
    .then(() => {
      // 加入保存的播放列表
      let _local_playlist = utils.readPlaylist();
      //TODO:rewrite wait to vue3
      player.value.playlistReplace(
        _local_playlist.song_list,
        _local_playlist.current_song
      );
      //TODO:rewrite wait to vue3
      player.value.playMode = utils.readSettings().play_mode;
      // 如果有查询参数就把这首歌加入播放列表
      const parsedUrl = new URL(window.location.href);
      let query = parsedUrl.searchParams.get("s");
      if (query !== null && query !== "") {
        let song_idx = window.AudioLists.song_list.findIndex(
          (s) => s.have_audio && s.id === query
        );
        if (song_idx !== -1)
          //TODO:rewrite wait to vue3
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
        let recommand_song_list = ["U00044", "U01506", "U00113", "U01500"];
        let song_list = recommand_song_list.map((i) =>
          window.AudioLists.song_list.find((s) => s.id === i)
        );
        console.log(song_list);
        player.value.playlistAddMany(song_list);
      }
    })
    .catch((e) => console.log(e));
};

onMounted(() => {
  init();
});
</script>

<template>
  <div id="app">
    <div class="c-outer">
      <banner />
      <input v-show="develop" type="checkbox" v-model="if_debug" />
      <div v-show="if_debug">
        <div v-for="(d, idx) in debug_list" v-bind:key="d + idx">{{ d }}</div>
      </div>
      <MainSongList ref="mainsonglist" />
      <AudioPlayer ref="player" />
      <countdown />
      <copy-call-code />
      <import-song-list />
      <Footer />
      <InfoPopUp v-if="showInfo" v-on:closepopup="showInfo = false" />
    </div>
  </div>
</template>

<style>
@import "styles/app.scss";
</style>
