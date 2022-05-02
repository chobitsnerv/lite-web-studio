<template>
  <div class="nowPlayingList">
    <div class="list-title">
      当前播放
    </div>
    <div class="list-mode">
      <div v-if="playMode===PlayMode.Loop1" class="list-mode-loop1">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" style="vertical-align: -0.125em;" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path fill="currentColor" d="M208 312v32h112v-32h-40V176h-32v24h-32v32h32v80h-40z"/><path fill="currentColor" d="M464 210.511V264a112.127 112.127 0 0 1-112 112H78.627l44.686-44.687l-22.626-22.626L56 353.373l-4.415 4.414l-33.566 33.567l74.022 83.276l23.918-21.26L75.63 408H352c79.4 0 144-64.6 144-144v-85.489Z"/><path fill="currentColor" d="M48 256a112.127 112.127 0 0 1 112-112h273.373l-44.686 44.687l22.626 22.626L456 166.627l4.117-4.116l33.864-33.865l-74.022-83.276l-23.918 21.26L436.37 112H160c-79.4 0-144 64.6-144 144v85.787l32-32Z"/></svg>
        单曲循环
      </div>
      <div v-else-if="playMode===PlayMode.Random" class="list-mode-random">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" style="vertical-align: -0.125em;" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M4 17a1 1 0 0 1 0-2h2l3-3l-3-3H4a1.001 1.001 0 0 1 0-2h3l4 4l4-4h2V5l4 3.001L17 11V9h-1l-3 3l3 3h1v-2l4 3l-4 3v-2h-2l-4-4l-4 4H4Z"/></svg>
        随机播放
      </div>
      <div v-else-if="playMode===PlayMode.Order" class="list-mode-order">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" style="vertical-align: -0.125em;" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M17 4V2.068a.5.5 0 0 1 .82-.385l4.12 3.433a.5.5 0 0 1-.321.884H2V4h15zM2 18h20v2H2v-2zm0-7h20v2H2v-2z"/></svg>
        顺序播放
      </div>
    </div>
    <div class="list-body">
      <div
          v-for="item in props.nowPlayingList" :key="item.name"
           class="list-body-item"
          :class="{'nowPlaying':props.playState.nowPlaying===item}"
      >
        <div>
          {{item.name}}
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" style="vertical-align: -0.125em;" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41L17.59 5Z"/></svg>
        </div>
      </div>
    </div>
    <teleport to="body">
      <div class="mask" @click="emits('close')">

      </div>
    </teleport>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name:'NowPlayingList'
})
</script>
<script lang="ts" setup>
import {Song} from "@/types/HomePage/HomePageTypes";
import {PlayState} from "@/views/Player/audioEventEmitter";
enum PlayMode{
  Order,
  Random,
  Loop1
}
const props=defineProps<{
  nowPlayingList:Array<Song>,
  playState:PlayState
}>()
const emits=defineEmits<{
  (e:'close'):void
}>()
const playMode=ref<PlayMode>(PlayMode.Order)
</script>
<style lang="scss" scoped>
.nowPlayingList{
  border-radius: 10px;
  box-sizing: border-box;
  color:black;
  background-color: rgb(250,250,250);
  padding: 14px;
  .list-title{
    text-align: center;
  }
  .list-mode{
    padding-bottom: 6px;
    border-bottom:2px solid rgb(230,230,230);
    margin-bottom: 6px;
  }
  .list-body{
    box-sizing: border-box;
    height: 280px;
    overflow: scroll;
    padding-bottom: 20px;
    .list-body-item{
      display: flex;
      justify-content: space-between;
      margin-bottom:6px;
    }
    .nowPlaying{
     color:rgb(0,127,255);
    }

  }
  .list-body::-webkit-scrollbar{
    width: 0;
  }

}
.mask{
  width: 100%;
  height: 100%;
  background-color:rgba(0,0,0,0.25);
  position: absolute;
  top:0;
}

</style>