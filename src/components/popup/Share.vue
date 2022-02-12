<script>
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "SharePopUp",
});
</script>

<script setup>
import MainPopUp from "popup/Main.vue";
import utils from "utils/utils.js";

const song_popper = {
  content: "已成功复制到剪切板",
  showTriggers: ["click"],
  hideTriggers: ["hover"],
};

const songlist_popper = {
  content: "已成功复制到剪切板",
  showTriggers: ["click"],
  hideTriggers: ["hover"],
};

const props = defineProps({
  song: Object,
});

const emit = defineEmits(["closepopup"]);

const playlistID = computed(() => {
  return utils.encodeShare();
});

const copy = (text, popper) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => {
        popper.content = "已成功复制到剪切板";
      },
      function () {
        popper.content = "无剪切板权限，请手动复制";
      }
    );
  } else popper.content = "你的浏览器尚不支持，请手动复制";
};
</script>

<template>
  <MainPopUp v-on:closepopup="$emit('closepopup')" title="分享歌曲">
    <div>
      <div class="c-share-body">
        <div class="c-share-title">
          <div class="share-title">复制链接分享当前歌曲</div>
          <button
            slot="reference"
            class="copy-button"
            v-on:click="
              copy('https://song.meumy.club/?s=' + props.song?.id, song_popper)
            "
            v-tooltip="song_popper"
          >
            复制到剪切板
          </button>
        </div>
        <div>
          <a v-bind:href="'https://song.meumy.club/?s=' + props.song?.id"
            >https://song.meumy.club/?s={{ props.song?.id }}</a
          >
        </div>
      </div>
      <hr />
      <div class="c-share-body">
        <div class="c-share-title">
          <div class="share-title">复制代码分享歌单</div>
          <button
            id="share-songlist-button"
            class="copy-button"
            v-on:click="copy(playlistID, songlist_popper)"
            v-tooltip="songlist_popper"
          >
            复制到剪切板
          </button>
        </div>
        <div class="share-list-text">{{ playlistID }}</div>
      </div>
      <hr />
      <div class="c-share-body">
        <div class="c-share-title">
          <div class="share-title">下载当前歌曲</div>
          <a v-bind:href="props.song?.src" download>点击下载</a>
        </div>
        <div class="c-share-title">
          <div class="share-title">下载全部歌曲数据库</div>
          <a href="/static/song database.csv" download>点击下载</a>
        </div>
      </div>
    </div>
  </MainPopUp>
</template>

<style scoped>
@import "styles/share.scss";
</style>
