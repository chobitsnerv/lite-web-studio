import { createApp } from "vue";
import App from "./App_Refactor.vue";
import {getSongData} from "@/utils_refactor/file_reader";
import {router} from "@/router/router";
import {AudioEventEmitter} from "@/views/Player/audioEventEmitter";
import {Song} from "@/types/HomePage/HomePageTypes";
//初始化一些基础项目
(async function init(){
  const songListInfo=await getSongData()
  const audioListGlobal=Symbol.for('audioListGlobal')
  const audioNowPlayingListGlobal=Symbol.for('audioNowPlayingListGlobal')
  window[audioListGlobal]=songListInfo
  window[audioNowPlayingListGlobal]=[]

  const audioEmitter=AudioEventEmitter.getInstance()

  audioEmitter.on('addSongAndPlayNow',(songs:Song[])=>{
    window[audioNowPlayingListGlobal]=[...songs,...window[audioNowPlayingListGlobal]]
    audioEmitter.dispatch("audioNowPlayingListGlobalChanged")
    audioEmitter.dispatch("changeNowPlaying",{index:0})
  })

  const app = createApp(App);
  app.use(router)
  app.mount("#app");

})()
