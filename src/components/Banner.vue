<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Banner",
});
</script>

<template>
  <div class="c-title card">
    <div class="banner-video">
      <video playsinline="" autoplay="" loop="" muted="">
        <source src="@/assets/banner.mp4?url" type="video/mp4" />
      </video>
    </div>
    <div class="banner-logo">
      <img src="@/assets/official-white.png?url" alt="logo" />
    </div>
    <div class="title-info">
      <h1>{{ $t('bannerTitle') }}</h1>
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
