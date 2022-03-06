<script>
import { defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "Footer",
});
</script>

<script setup>
import CreditPopUp from "popup/Credit.vue";

const cutter = ref([]);
const showCredit = ref(false);

onMounted(() => {
  const _list = window.AudioLists.cutter_list;
  cutter.value = _list[Math.floor(Math.random() * _list.length)];
});
</script>

<template>
  <div class="c-footer">
    <p>
      {{ $t('footer1') }}
      <a
        href="https://zh.moegirl.org.cn/A-SOUL"
        target="_blank"
        rel="noreferrer noopener"
        >A-SOUL</a
      >？ 赶快去看看她们的直播间：
      >{{ $t('footer2') }}
      <a
        href="https://live.bilibili.com/22625025"
        target="_blank"
        rel="noreferrer noopener"
        >@向晚AvA
      </a>
      <a
        href="https://live.bilibili.com/22632424"
        target="_blank"
        rel="noreferrer noopener"
        >@贝拉Bella</a
      >
      <a
        href="https://live.bilibili.com/22634198"
        target="_blank"
        rel="noreferrer noopener"
        >@珈乐Carol</a
      >
      <a
        href="https://live.bilibili.com/22637261"
        target="_blank"
        rel="noreferrer noopener"
        >@嘉然Diana</a
      >
      <a
        href="https://live.bilibili.com/22625027"
        target="_blank"
        rel="noreferrer noopener"
        >@乃琳Eileen</a
      >
    </p>
    <p>
      {{ $t('footer3') }}
      <a
        href="https://discord.gg/TKyrqHqNyS"
        target="_blank"
        rel="noreferrer noopener"
        >{{ $t('footer4') }}</a
      >
      {{ $t('footer5') }}
    </p>
    <hr />
    <p>
      {{ $t('footer6') }}
      <a v-on:click="showCredit = true" class="credit">{{ $t('footer7') }}</a>
    </p>
    <p>
      {{ $t('footer8') }}
      <a
        v-bind:href="'https://space.bilibili.com/' + cutter[0]"
        target="_blank"
        rel="noreferrer noopener"
        >@{{ cutter[1] }}</a
      >
    </p>
    <hr />
    <p class="links">
      {{ $t('link') }}
      <a
        href="https://asoul1.asoul-rec.com/"
        target="_blank"
        rel="noreferrer noopener"
        >{{ $t('A-SOULRecord') }}</a
      >
      <a
        href="https://www.youtube.com/channel/UCrC6Xdxx5Jmo3m0cPi-u_cw"
        target="_blank"
        rel="noreferrer noopener"
        >{{ $t('A-soulMomentsYoutube') }}</a
      >
      <a href="https://asoul.jp/" target="_blank" rel="noreferrer noopener"
        >ASファンサイト</a
      >
      <a href="https://asoulfan.com/" target="_blank" rel="noreferrer noopener"
        >Project ASF</a
      >
    </p>
    <p class="links">
      <a
        href="https://bbs.a-soul.fans"
        target="_blank"
        rel="noreferrer noopener"
        >AS BBS</a
      >
      <a href="https://pt.a-soul.fans" target="_blank" rel="noreferrer noopener"
        >ASPT</a
      >
      <a
        href="https://asoulworld.com/"
        target="_blank"
        rel="noreferrer noopener"
        >A-SOUL WORLD导航站</a
      >
      <a href="https://asdb.live" target="_blank" rel="noreferrer noopener"
        >A-SOUL Database</a
      >
    </p>
    <CreditPopUp v-if="showCredit" v-on:closepopup="showCredit = false" />
  </div>
</template>

<style scoped>
@import "@/styles/footer.scss";
</style>
