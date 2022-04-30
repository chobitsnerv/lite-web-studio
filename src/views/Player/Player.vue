<template>
  <div class="player">
    <div class="titleBar">
      <div class="titleBar-songinfo">
        {{playState.nowPlaying?playState.nowPlaying.name+' - '+playState.nowPlaying.singer:'暂未加入歌曲'}}
      </div>
      <div class="titleBar-tools">
        <div class="tools-play" @click="onPlayButtonClicked">
          <svg v-if="playState.state==='stopped'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path fill="currentColor" d="M7 28a1 1 0 0 1-1-1V5a1 1 0 0 1 1.482-.876l20 11a1 1 0 0 1 0 1.752l-20 11A1 1 0 0 1 7 28Z"/></svg>
          <svg v-else-if="playState.state==='playing'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 5v14M17 5v14"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5"/><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"/></path></svg>
        </div>
        <div class="tools-musicList">
          <i-ic-round-queue-music />
         </div>
      </div>
    </div>
    <div class="audio-instance">
      <audio id="audio-player" ref="audioPlayer"></audio>
    </div>
    <div class="processbar">

      <div class="processbar-body">
        <div class="processbar-bar--unused">

        </div>
        <div class="processbar-bar--used" :style="{left:elapsedPercent+'%'}">

        </div>
        <div class="processbar-bar-slide" :style="{left:100+elapsedPercent+'%'}">

        </div>
      </div>
      <div class="processbar-info">
        <div class="processbar-info-begintime">
          {{ timeParser(playState.elapsed) }}
        </div>
        <div class="processbar-info-endtime">
          {{timeParser(playState.duration)}}
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { Song } from "@/types/HomePage/HomePageTypes";
import {AudioEventEmitter, PlayState} from "@/views/Player/audioEventEmitter";
import {ref} from "vue";
import utils from '@/utils/utils.js'

const audioEmitter= AudioEventEmitter.getInstance()
const audioPlayer = ref<HTMLAudioElement>()
const audioPlayList=ref<Song[]>([])
const playState=ref<PlayState>({
  nowPlaying:null,
  nextToPlay:null,
  playIndex:0,
  elapsed:0,
  state:'stopped',
  duration:0
})
const elapsedPercent=ref(-100)
//TODO 缓存
const applySong = async () => {
  let _src = null;
  _src = utils.getResourceURL(
      !(playState.value.nowPlaying!.has_sec_version === "TRUE"),
      true,
      false,
      playState.value.nowPlaying!.date,
      playState.value.nowPlaying!.name,
      playState.value.nowPlaying!.file_type,
      playState.value.nowPlaying!.singer
  );
  audioPlayer.value!.src = _src.replace("『", "【").replace("』", "】");
  // 更改media session信息
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: playState.value.nowPlaying!.name,
      artist: playState.value.nowPlaying!.singer,
      album: "",
      artwork: [{ src: "../assets/logo.png" }],
    });
  }
};
//TODO 加载状态
function onPlayButtonClicked(){
  if(playState.value.state==='playing'){
    playState.value.state='stopped'
  }else{
    playState.value.state='loading'
  }
  applySong()
}
function timeParser(time:number){
  let minute=Math.floor(time/60)
  let second=Math.floor(time)-minute*60
  return `${minute<10?0:''}${minute}:${second<10?0:''}${second}`
}
onMounted(()=>{
  audioEmitter.on('audioNowPlayingListGlobalChanged',()=>{
    audioPlayList.value=window[Symbol.for('audioNowPlayingListGlobal')]
  })
  audioEmitter.on("changeNowPlaying",(info)=>{
    audioEmitter.playState={
      nowPlaying:audioPlayList.value[info.index],
      elapsed:0,
      nextToPlay:audioPlayList.value[info.index+1]||null,
      playIndex:info.index,
      state:'loading',
      duration:0
    }
    elapsedPercent.value=-100
    playState.value=audioEmitter.playState
  })
  audioPlayer.value?.addEventListener('loadeddata',()=>{
    audioEmitter.playState.duration=audioPlayer.value!.duration
    console.log(audioPlayer.value!.duration)
  })
  audioPlayer.value?.addEventListener('timeupdate',()=>{
    audioEmitter.playState.elapsed=audioPlayer.value!.currentTime
    if(audioEmitter.playState.duration!==0){
      elapsedPercent.value=-100+audioEmitter.playState.elapsed/audioEmitter.playState.duration*100
    }
  })
  audioPlayer.value?.addEventListener('canplay',()=>{
    if(playState.value.state==='loading'){
      playState.value.state='playing'
      audioPlayer.value?.play()
    }
  })
})
</script>

<script lang="ts">
export default defineComponent({
  name:'AudioPlayer'
})
</script>

<style scoped lang="scss">
.player{
  background-color: rgb(153,200,226);
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
  height: 100px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .titleBar{
    color:white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .titleBar-songinfo{
      margin-left:10px;
    }
    .titleBar-tools{
      display: flex;
      align-items: center;
      height: 40px;
      .tools-play{
        width: 30px;
        height: 30px;
        margin-right: 10px;
        svg{
          width: 30px;
          height: 30px;
        }

      }
      .tools-musicList{
        width: 40px;
        height: 40px;
        svg{
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  .processbar{
    margin-top:6px;
    height: 10px;
    .processbar-body{
      overflow: hidden;
      position: relative;
      height: 10px;

      .processbar-bar--unused{
        position: absolute;
        height: 4px;
        margin:auto 0;
        width: 100%;
        top:50%;
        transform: translateY(-50%);
        background-color: white;
      }
      .processbar-bar-slide{
        width: 10px;
        height: 10px;
        position: absolute;
        border-radius: 10px;
        background-color: white;
        &:hover{
          cursor: pointer;
        }
      }
      .processbar-bar--used{
        height: 4px;
        width: 100%;
        position: absolute;
        top:50%;
        transform: translateY(-50%);
        background-color: rgb(0,127,255);
      }
    }
    .processbar-info{
      display: flex;
      justify-content: space-between;
      margin-top:4px;
      font-size: 14px;
      .processbar-info-begintime{

      }
      .processbar-info-endtime{

      }
    }

  }
}
</style>