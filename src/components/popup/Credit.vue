<script>
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "CreditPopUp",
});
</script>

<script setup>
import MainPopUp from "popup/Main.vue";

const cutterList = ref([]);

onMounted(() => {
  // 提取切歌人
  let _rawList = window.AudioLists.song_list.map((i) => i.ref_cut);
  _rawList = _rawList.filter((i) => i !== false);
  // 去重计数
  for (const cutter of _rawList) {
    const _idx = cutterList.value.findIndex((u) => u.uid === cutter.uid);
    if (_idx === -1) cutterList.value.push({ ...cutter, count: 1 });
    else cutterList.value[_idx].count += 1;
  }
  // 按数量排序
  cutterList.value.sort((u1, u2) => u2.count - u1.count);
});

const emit = defineEmits(["closepopup"]);
</script>

<template>
  <MainPopUp
    v-on:closepopup="$emit('closepopup')"
    title="关于"
    class="popup-credit"
  >
    <div class="content">
      <p>感谢录播评论区的各位路灯man，找歌过程中帮了太多忙（哭泣</p>
      <p>
        感谢
        <span
          v-for="cutter in cutterList"
          v-bind:key="cutter.uid"
          class="cutter"
        >
          <a
            v-bind:href="'https://space.bilibili.com/' + cutter.uid"
            target="_blank"
            rel="noreferrer noopener"
          >
            @{{ cutter.name }}</a
          >
          ({{ cutter.count }})
        </span>
        切的歌，给录音棚添加了很多存货（鞠躬
      </p>
      <p>
        有问题？或者想帮忙！（提前感谢）狂戳这个人->
        <a
          href="https://message.bilibili.com/#/whisper/mid1818479062"
          target="_blank"
          rel="noreferrer noopener"
          >@呜米小姐的吃饭小虎牙</a
        >
        的b站私信！
      </p>
      <p>
        本项目已开源（
        <a
          href="https://github.com/K-bai/csv-based-web-music-player"
          target="_blank"
          rel="noreferrer noopener"
          >Github</a
        >
        ）欢迎Star, Fork！感谢
        <a
          href="https://space.bilibili.com/9420577"
          target="_blank"
          rel="noreferrer noopener"
          >@特斯拉309</a
        >
        的技术支持！
      </p>
    </div>
  </MainPopUp>
</template>

<style scoped>
@import "styles/credit.scss";
</style>
