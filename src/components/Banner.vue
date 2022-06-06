<script>
export default defineComponent({
  name: "Banner",
});
</script>

<template>
  <div class="c-title card">
    <div class="banner-video">
      <video playsinline="" autoplay="" loop="" muted="">
        <source
          src="https://link.01.asbbs.static.a-soul.fans/uploads/files/1/banner_1646556711136.mp4"
          type="video/mp4"
        />
      </video>
    </div>
    <div class="banner-logo">
      <!-- <img src="/favicon.svg" alt="logo" /> -->
    </div>
    <div class="title-info">
      <h1>录音棚</h1>
      <div class="title-detail">
        <div>A-SOUL时代，沸腾期待！</div>
        <div>录音棚收录了几乎全部solo和合唱的歌</div>
        <div>
          还没关注?
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
