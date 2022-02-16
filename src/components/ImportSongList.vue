<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "ImportSongList",
});
</script>

<script setup>
import utils from "utils/utils.js";
import bus from "vue3-eventbus";

const sharecode = ref("");
const tooltipsContent = ref("");

const importCode = () => {
  if (sharecode.value.trim().length === 0) {
    tooltipsContent.value = "你没粘贴东西?";
    return;
  }
  const _songList = utils.decodeShare(sharecode.value.trim());
  if (_songList.length > 0) {
    bus.emit(
      "playlist-replace-event",
      _songList.filter((s) => s.have_audio)
    );
    tooltipsContent.value = "导入成功!";
  } else tooltipsContent.value = "歌单代码错误，请重新复制一下试试~";
  sharecode.value = "";
};
</script>

<template>
  <div class="c-import card">
    <div class="import-info">
      <div>粘贴代码导入歌单：</div>
      <VTooltip :showTriggers="['click']" :hideTriggers="['hover']">
        <button class="import-button" v-on:click="importCode">导入！</button>
        <template #popper> {{ tooltipsContent }} </template>
      </VTooltip>
    </div>
    <textarea
      class="import-code"
      v-model="sharecode"
      v-on:keydown.space.stop=""
    ></textarea>
  </div>
</template>

<style scoped>
@import "styles/importsonglist.scss";
</style>
