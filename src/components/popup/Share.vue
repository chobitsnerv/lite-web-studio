<script>
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "SharePopUp",
});
</script>

<script setup>
import MainPopUp from "popup/Main.vue";
import utils from "utils/utils.js";

const baseURL = import.meta.env.VITE_APP_BASE_API;

const songTooltips = {
  content: "已成功复制到剪切板",
};

const songlistTooltips = {
  content: "已成功复制到剪切板",
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
          <VTooltip :showTriggers="['click']" :hideTriggers="['hover']">
            <button
              slot="reference"
              class="copy-button"
              v-on:click="copy(baseURL + props.song?.id, songTooltips)"
            >
              复制到剪切板
            </button>
            <template #popper> {{ songTooltips.content }} </template>
          </VTooltip>
        </div>
        <div>
          <a v-bind:href="baseURL + props.song?.id"
            >{{ baseURL }}?s={{ props.song?.id }}</a
          >
        </div>
      </div>
      <hr />
      <div class="c-share-body">
        <div class="c-share-title">
          <div class="share-title">复制代码分享歌单</div>

          <VTooltip :showTriggers="['click']" :hideTriggers="['hover']">
            <button
              id="share-songlist-button"
              class="copy-button"
              v-on:click="copy(playlistID, songlistTooltips)"
            >
              复制到剪切板
            </button>
            <template #popper> {{ songlistTooltips.content }} </template>
          </VTooltip>
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
