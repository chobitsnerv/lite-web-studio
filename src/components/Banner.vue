<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Banner",
});
</script>

<template>
  <div class="c-title card">
    <div class="title-info">
      <h1>MeUmy的录音棚</h1>
      <div class="title-detail">
        <div>来听听草原上小狼和小羊的歌声吧！</div>
        <div>录音棚收录了几乎全部呜米和一部分咩栗直播唱的歌</div>
        <div>
          还没关注
          <a
            href="https://space.bilibili.com/617459493"
            target="_blank"
            rel="noreferrer noopener"
            >@呜米
          </a>
          <a
            href="https://space.bilibili.com/745493"
            target="_blank"
            rel="noreferrer noopener"
            >@咩栗</a
          >
          ？搞快关注！
        </div>
        <div>
          网易云音乐：
          <a
            href="https://music.163.com/#/user/home?id=1306304320"
            target="_blank"
            rel="noreferrer noopener"
            >@呜米嗷嗷嗷
          </a>
          <a
            href="https://music.163.com/#/user/home?id=1356709812"
            target="_blank"
            rel="noreferrer noopener"
            >@咩栗咩咩咩</a
          >
        </div>
      </div>
    </div>
    <img class="logo-img" src="@/assets/logo_dark.png?url" />
  </div>
</template>

<style scoped>
@import "styles/banner.scss";
</style>
