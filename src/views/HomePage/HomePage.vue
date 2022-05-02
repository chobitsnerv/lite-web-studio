<template>
  <div>
    <div class="homepage-search">
      <div class="search-input">
        <el-icon>
          <Search/>
        </el-icon>
        <input v-model="searchText" type="text" placeholder="Search">
      </div>
    </div>
  </div>
  <div class="homepage-songList">
    <div class="songList-title">
      推荐歌单
    </div>
    <div class="songList-list">
      <div v-for="item in _debugSongCollection" :key="item" class="songList-list-item">
        <MusicListCard :song="item">
          <template #desc>
            {{item.name}}
          </template>
        </MusicListCard>
      </div>
    </div>
  </div>
  <div class="mySongList">
    <div class="mySongList-nav">
      <div
          class="mySongList-nav-item"
          :class="{'mySongList-nav-active':mySongListNavIndex===0}"
          @click="changeMySongListNavIndex(0)"
      >
        自建歌单
      </div>
      <div
          class="mySongList-nav-item"
          :class="{'mySongList-nav-active':mySongListNavIndex===1}"
          @click="changeMySongListNavIndex(1)"
      >
        收藏歌单
      </div>
    </div>
    <div v-if="mySongListNavIndex===0" class="mySongList-list">
      <div
            v-for="item in _debugSongCollection.slice(5)"
            :key="item.name"
            class="mySongList-list-item"
            @click="onMySongListCardClicked(item)"
      >
        <div class="mySongList-list-item-img" :style="{backgroundColor:colorSubstitute}">
        </div>
        <div class="mySongList-list-item-desc">
          <div>
            {{item.name}}
          </div>
          <div>
            {{item.song_list.length}}首
          </div>
        </div>
      </div>
      <div class="mySongList-list-addNew">
        <div class="mySongList-addNew-icon">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8=""><path fill="currentColor" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"></path></svg>
        </div>
        <div class="mySongList-addNew-desc">
          创建你的歌单吧！
        </div>
      </div>
    </div>
    <div v-else class="mySongList-list">
      2
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "HomePage",
});
</script>

<script lang="ts" setup>
import MusicListCard from './MusicListCard'
import {Search} from '@element-plus/icons-vue'
import {SongCollection} from "@/types/HomePage/HomePageTypes";
import {router} from "@/router/router";
const colorSubstitute=["#E799B0","#576690","#B8A6D9","#BD7D74","#9AC8E2"][Math.floor(5*Math.random())];
const _debugSongCollection=ref<Array<SongCollection>>(window[Symbol.for('audioListGlobal')].song_collection)
const searchText=ref('')
const mySongListNavIndex=ref(0)
function changeMySongListNavIndex(index:number){
  mySongListNavIndex.value=index
}
function onMySongListCardClicked(item:SongCollection){
  router.push({path:'songlist',query:{id:item.name},state:{song:toRaw(item)}})
}
</script>

<style lang="scss" scoped>
.homepage-search{
  .search-input{
    padding:8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    background-color: rgb(239,239,239);
    input{
      background-color: rgb(239,239,239);
      outline: none;
      border:none;
      font-size: 12px;
    }
  }
}
.homepage-songList{
  .songList-title{
    margin-bottom: 6px;
    margin-top:6px;
    font-weight: bold;
  }
  .songList-list{
    display: flex;
    overflow-x: scroll;
    .songList-list-item{
      margin-right: 6px;
    }
  }
  .songList-list::-webkit-scrollbar{
    width: 0;
  }
}
.mySongList{
  .mySongList-nav{
    display: flex;
    justify-content: space-around;
    .mySongList-nav-item{
      width: 46%;
      text-align: center;
       font-weight: bold;
    }
    .mySongList-nav-active{
      border-bottom: 2px solid rgb(149,150,149);
    }
    margin-bottom: 16px;
  }
  .mySongList-list{
    margin-left:20px;

    box-sizing: border-box;
    .mySongList-list-item{
      margin-bottom: 10px;
      display: flex;
      .mySongList-list-item-img{
        width: 50px;
        height: 50px;
        border-radius: 8px;
      }
      .mySongList-list-item-desc{
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
    .mySongList-list-addNew{
      display: flex;
      .mySongList-addNew-icon{
        box-sizing: border-box;
        border: 2px solid rgb(204,204,204);
        width: 50px;
        height: 50px;
        color:rgb(112,112,112);
        border-radius: 8px;
        text-align: center;
        svg{
          margin-top:6px;
          width: 34px;
          transform: rotate(45deg);
        }
      }
      .mySongList-addNew-desc{
        margin-left:10px;
        font-size: 14px;
      }
    }
  }
}
</style>