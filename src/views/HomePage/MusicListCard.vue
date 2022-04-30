<template>
  <div class="musicListCard" @click="onSongListCardClicked">
    <div v-if="url!==''">
      <img class="picture" src="" alt="">
    </div>
    <div v-else>
      <div class="picture" :style="{backgroundColor:colorSubstitute}"></div>
    </div>
    <slot name="desc" class="desc"></slot>
  </div>
</template>

<script>
export default defineComponent({
  name: "MusicListCard",
});
</script>

<script setup>
import {ref} from "vue";
import {router} from "@/router/router";

const colorSubstitute=["#E799B0","#576690","#B8A6D9","#BD7D74","#9AC8E2"][Math.floor(5*Math.random())];
const url=ref("")
const props=defineProps(['song'])
function onSongListCardClicked(){
  console.log(props.song)
  router.push({path:'songlist',query:{id:props.song.name},state:{song:toRaw(props.song)}})
}
</script>

<style lang="scss" scoped>
.musicListCard{
  .picture{
    width: 100px;
    height: 100px;
    border-radius: 8px;
  }
  font-size: 14px;
}
</style>