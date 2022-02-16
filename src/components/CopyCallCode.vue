<script>
import { defineComponent, reactive, ref } from "vue";
export default defineComponent({
  name: "CopyCallCode",
});
</script>

<script setup>
const callList = reactive([
  {
    name: "umy",
    code: "☀️呜米☀️呜米☀️呜米☀️呜米☀️",
    popper: {
      content: "?",
    },
  },
  {
    name: "merry",
    code: "⛈️咩栗⛈️咩栗⛈️咩栗⛈️咩栗⛈️",
    popper: {
      content: "?",
    },
  },
  {
    name: "meumy",
    code: "⛅MeUmy⛅MeUmy⛅MeUmy⛅",
    popper: {
      content: "?",
    },
  },
]);

const copy = (idx) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(callList[idx].code).then(
      () => {
        callList[idx].popper.content = "已成功复制到剪切板";
      },
      function () {
        callList[idx].popper.content = "无剪切板权限，请手动复制";
      }
    );
  } else callList[idx].popper.content = "你的浏览器尚不支持，请手动复制";
};
</script>

<template>
  <div class="c-copy-code">
    <div v-for="(up, idx) in callList" v-bind:key="up.name" class="copy-item">
      <VTooltip :showTriggers="['click']" :hideTriggers="['hover']">
        <a
          v-tooltip="up.popper.value"
          v-on:click="copy(idx)"
          class="copy-button"
          >{{ up.code }}</a
        >
        <template #popper> {{ up.popper.content }} </template>
      </VTooltip>
    </div>
  </div>
</template>

<style scoped>
@import "styles/copycallcode.scss";
</style>
