<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "InfoPopUp",
});
</script>

<script setup>
import MainPopUp from "popup/Main.vue";

const cutter = ref(window.AudioLists.cutter_list);

const emit = defineEmits(["closepopup"]);
</script>

<template>
  <MainPopUp v-on:closepopup="$emit('closepopup')" title="欢迎！">
    <div class="content">
      <p>看到你是首次打开，球球你关注一下在b站的MeUmy切歌man吧！！！</p>
      <p>
        随便给你推荐几个：
        <a
          v-for="c in cutter"
          v-bind:key="c[0]"
          v-bind:href="'https://space.bilibili.com/' + c[0]"
          target="_blank"
          rel="noreferrer noopener"
          >@{{ c[1] }}</a
        >
      </p>
      <p>快乐听歌鸭！~</p>
    </div>
  </MainPopUp>
</template>

<style scoped>
@import "styles/info.scss";
</style>
