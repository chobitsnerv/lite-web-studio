<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "InfoPopUp",
});
</script>

<script setup>
import MainPopUp from "popup/Main.vue";
import shuffle from "lodash.shuffle";

const cutter = ref(
  shuffle(window.AudioLists.cutter_list).slice(0, CUTTER_DISPLAY_MAX)
);

const emit = defineEmits(["closepopup"]);
</script>

<template>
  <MainPopUp v-on:closepopup="$emit('closepopup')" title="欢迎来到AS录音棚！">
    <div class="content">
      <p>今天有好好吃饭吗？</p>
      <p>
        随便给你推荐几个AS社区的小伙伴，喜欢的话可以关注一下捏：
        <a
          v-for="c in cutter"
          v-bind:key="c[0]"
          v-bind:href="'https://space.bilibili.com/' + c[0]"
          target="_blank"
          rel="noreferrer noopener"
          >@{{ c[1] }}</a
        >
      </p>
      <p>和所有的烦恼说白白，和全部的快乐索嗨嗨！一起来愉快地听歌鸭~！</p>
    </div>
  </MainPopUp>
</template>

<style scoped>
@import "@/styles/info.scss";
</style>
