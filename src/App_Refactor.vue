<template>
  <router-view></router-view>
  <div class="audio-player-bar">
    <Player/>
  </div>
</template>

<script>
export default {
  name: "AppRefactor"
}
</script>
<script setup>
import Player from "@/views/Player/Player";
</script>

<style scoped>
  .audio-player-bar{
    position: absolute;
    bottom: 0;
    z-index: 100;
    width: calc(100% - 12px);
  }
</style>
<style>
html{
  width: 100%;
  height: 100%;
}
body{
  margin:0;
  padding:0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
#app{
  padding:6px;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>