<script>
export default {
  name: "App",
};
</script>

<script setup>
import { onMounted } from "@vue/runtime-core";
import song_data from "utils/data.js";
import utils from "utils/utils.js";
import AudioPlayer from "components/AudioPlayer.vue";

//debug用变量，由于没响应式需求所以不用ref创建
const develop = false;
const ifDebug = false;
const showInfo = false;
const debugList = window.Variables.debug_list;

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
      let c_playlist = utils.read_playlist();
      //TODO:rewrite wait to vue3
      this.$refs.player.playlist_replace(
        c_playlist.song_list,
        c_playlist.current_song
      );
      //TODO:rewrite wait to vue3
      this.$refs.player.play_mode = utils.read_settings().play_mode;
      // 如果有查询参数就把这首歌加入播放列表
      const parsedUrl = new URL(window.location.href);
      let query = parsedUrl.searchParams.get("s");
      if (query !== null && query !== "") {
        let song_idx = window.meumy.song_list.findIndex(
          (s) => s.have_audio && s.id === query
        );
        if (song_idx !== -1)
          //TODO:rewrite wait to vue3
          this.$refs.player.playlist_add_song(
            window.meumy.song_list[song_idx],
            true
          );
        // 清空地址栏的查询参数
        window.history.replaceState({}, "", window.location.pathname);
      }
      // 看看是不是首次打开
      if (utils.if_first_browse()) {
        // 首次打开就播放推荐曲
        this.show_info = true;
        // 光 逆光 我的偶像宣言 Fansa
        let recommand_song_list = ["U00044", "U01506", "U00113", "U01500"];
        let song_list = recommand_song_list.map((i) =>
          window.meumy.song_list.find((s) => s.id === i)
        );
        console.log(song_list);
        //TODO:rewrite wait to vue3
        this.$refs.player.playlist_add_many(song_list);
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
      <main-song-list ref="main" />
      <AudioPlayer ref="player" />
      <countdown />
      <copy-call-code />
      <import-song-list />
      <v-footer />
      <pop-up-info v-if="showInfo" v-on:closepopup="showInfo = false" />
    </div>
  </div>
</template>

<style>
@import "styles/app.scss";
</style>
