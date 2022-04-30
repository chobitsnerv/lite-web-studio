<template>
<div class="songCollectionPage">
  <div class="titleBar">
    <div class="backButton" @click="onBackButtonClick">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8=""><path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"></path></svg>
    </div>
    <div class="title">
      {{song.name}}
    </div>
  </div>
  <div class="toolBar">
    <div class="toolBar-left">
      <div class="toolBar-left-play" @click="onAddAllButtonClick">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8=""><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path></svg>
      </div>
      <div class="toolBar-left-play-desc">播放全部</div>
    </div>
    <div class="toolBar-right">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8=""><path fill="currentColor" d="M389.44 768a96.064 96.064 0 0 1 181.12 0H896v64H570.56a96.064 96.064 0 0 1-181.12 0H128v-64h261.44zm192-288a96.064 96.064 0 0 1 181.12 0H896v64H762.56a96.064 96.064 0 0 1-181.12 0H128v-64h453.44zm-320-288a96.064 96.064 0 0 1 181.12 0H896v64H442.56a96.064 96.064 0 0 1-181.12 0H128v-64h133.44z"></path></svg>
    </div>
  </div>
  <div class="list">
    <div v-for="(item,index) in song.song_list" :key="item.id" class="list-item">
      <div class="list-item-index">{{index+1}}</div>
      <div class="list-item-info">
        <div class="item-info-songname">
          {{item.name}}
        </div>
        <div class="item-info-singer">
          {{item.singer}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
export default defineComponent({
  name:'SongCollectionPage'
})
</script>

<script setup lang="ts">
import {SongCollection} from "@/types/HomePage/HomePageTypes";
import {router} from '@/router/router'
import {AudioEventEmitter} from "@/views/Player/audioEventEmitter";
const song:SongCollection=history.state.song
const audioEmitter=AudioEventEmitter.getInstance()
onMounted(()=>{
  console.log(song.song_list[0])
})
function onBackButtonClick(){
  router.back()
}
function onAddAllButtonClick(){
  audioEmitter.dispatch('addSongAndPlayNow',song.song_list)
}
</script>

<style lang="scss" scoped>
.songCollectionPage{
  .titleBar{
    background-color: rgb(153,200,226);
    height: 80px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color:white;
    .backButton{
      width: 30px;
      position: absolute;
      left: 10px;
    }
    .title{
      font-size: 18px;
      font-weight: bold;
    }
  }
  .toolBar{
    display: flex;
    justify-content: space-between;
    padding: 8px 14px 8px 14px;
    .toolBar-left{
      display: flex;
      align-items: center;
      .toolBar-left-play{
        height: 30px;
        width: 30px;
        color:rgb(97,189,156);
      }
      .toolBar-left-play-desc{
        margin-left: 6px;
      }
    }
    .toolBar-right{
      width: 30px;
    }
  }
  .list{
    padding-left: 24px;
    .list-item{
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .list-item-index{

      }
      .list-item-info{
        margin-left:16px;
        font-size: 14px;
        .item-info-songname{

        }
        .item-info-singer{

        }
      }
    }
  }
}
</style>