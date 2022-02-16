<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "ExplainTreatedPopUp",
});
</script>

<script setup>
import MainPopUp from "popup/Main.vue";

const emit = defineEmits(["closepopup"]);
</script>

<template>
  <MainPopUp v-on:closepopup="$emit('closepopup')" title="经处理的歌">
    <div class="content">
      <p>
        经处理的歌是指将录播片段消除了说话的部分，但是音质可能有部分损失。仅有少部分歌曲经过处理，其他歌曲仍播放未处理版本。
      </p>
      <p>通常情况下，网站提供的音频是对录播音频进行简单剪辑，不做额外处理。</p>
      <p>
        这个处理过程是由<a
          href="https://space.bilibili.com/545133496"
          target="_blank"
          rel="noreferrer noopener"
          >@枺芙</a
        >完成的。
      </p>
    </div>
  </MainPopUp>
</template>

<style scoped></style>
