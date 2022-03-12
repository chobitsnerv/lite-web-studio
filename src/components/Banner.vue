<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Banner",
});
</script>

<script setup>
import {ref, watch} from "vue";

const timeOptions = ref([
  { text: "15分钟", value: 15 },
  { text: "30分钟", value: 30 },
  { text: "60分钟", value: 60 },
  { text: "120分钟", value: 120 },
  { text: "自定义", value: "custom" },
]);
const timeOption = ref(15);
watch(timeOption, (newV) => {
  if (newV) {
    console.log(timeOption.value)
  }
});
</script>

<template>
  <div class="c-title card">
    <div class="banner-video">
      <video playsinline="" autoplay="" loop="" muted="">
        <source src="https://asbbs-static-01.kzmidc.workers.dev/?file=/uploads/files/1/banner_1646556711136.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="banner-logo">
      <!-- <img src="/favicon.svg" alt="logo" /> -->
    </div>
    <div class="title-info">
      <h1>{{ $t('bannerTitle') }}</h1>

      <select
          class="general-input countdown-select"
          v-model="timeOption"
      >
        <option
            v-for="option in timeOptions"
            v-bind:key="option.text"
            v-bind:value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
      <div class="title-detail">
        <div>{{ $t('banner1') }}</div>
        <div>{{ $t('banner2') }}</div>
        <div>
          {{ $t('follow') }}
          <a
            href="https://space.bilibili.com/672346917/"
            target="_blank"
            rel="noreferrer noopener"
            >@向晚
          </a>
          <a
            href="https://space.bilibili.com/672353429/"
            target="_blank"
            rel="noreferrer noopener"
            >@贝拉</a
          >
          <a
            href="https://space.bilibili.com/351609538/"
            target="_blank"
            rel="noreferrer noopener"
            >@珈乐</a
          >
          <a
            href="https://space.bilibili.com/672328094/"
            target="_blank"
            rel="noreferrer noopener"
            >@嘉然</a
          >
          <a
            href="https://space.bilibili.com/672342685/"
            target="_blank"
            rel="noreferrer noopener"
            >@乃琳</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/banner.scss";
</style>
