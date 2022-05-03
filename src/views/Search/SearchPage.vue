<template>
  <div class="searchPage-search">
    <div class="search-titleBar">
      <div class="search-input-body">
        <div class="search-body-input">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em"
               preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"
                  d="m21 21l-4.486-4.494M19 10.5a8.5 8.5 0 1 1-17 0a8.5 8.5 0 0 1 17 0Z"/>
          </svg>
          <input ref="inputDom" v-model="textInput" type="text" @change="onSearchCommit">
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16"
             preserveAspectRatio="xMidYMid meet" viewBox="0 0 36 36">
          <path fill="currentColor"
                d="m19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41Z"
                class="clr-i-outline clr-i-outline-path-1"/>
          <path fill="none" d="M0 0h36v36H0z"/>
        </svg>
      </div>
      <div class="search-input-cancelButton" @click="onCancelButtonClicked">
        Cancel
      </div>
    </div>
    <div class="searchPage-result">
      <div class="result-display-title">
        歌曲信息
      </div>
      <div class="result-toolBar">
        <div class="toolBar-play" @click="onAddAllButtonClick">
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
            <path fill="currentColor"
                  d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path>
          </svg>
        </div>
        <div class="toolBar-play-desc">播放全部</div>
      </div>
      <div class="result-body">
        <div v-for="item,index in songFiltered" :key="item.name" class="result-item">
          <div class="result-item-index">
            {{ index }}
          </div>
          <div class="result-item-info">
            <div class="result-item-title">
              {{ item.name }} {{ item.date }}
            </div>
            <div class="result-item-otherInfo">
              {{ item.singer }}
            </div>
          </div>

        </div>
        <div v-if="songFiltered.length===0">
          暂无搜索结果
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: "SearchPage"
})
</script>
<script lang="ts" setup>
import {router} from "@/router/router";
import {Song} from "@/types/HomePage/HomePageTypes";

const textInput = ref('')
const inputDom = ref<HTMLInputElement>()
const songFiltered = ref<Song[]>([])
onMounted(() => {
  if (inputDom.value) {
    inputDom.value.focus()
  }
})

function onSearchCommit() {
  if (textInput.value === '') {
    return;
  }
  songFiltered.value = window[Symbol.for('audioListGlobal')].song_list.filter((v: Song) => v.name.includes(textInput.value) || v.chinese_name.includes(textInput.value))
}

function onCancelButtonClicked() {
  router.back();
}
</script>
<style lang="scss" scoped>
.searchPage-search {
  .search-titleBar {
    display: flex;
    align-items: center;

    .search-input-body {
      flex: 0 0 78%;
      padding: 8px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: rgb(239, 239, 239);

      .search-body-input {
        display: flex;
        align-items: center;

        input {
          width: 246px;
          background-color: rgb(239, 239, 239);
          outline: none;
          border: none;
          font-size: 12px;
        }

      }
    }

    .search-input-cancelButton {
      height: 100%;
      box-sizing: border-box;
      padding-left: 10px;
      font-size: 16px;
      flex: 0 0 22%;
    }
  }

  .searchPage-result {
    box-sizing: border-box;
    padding: 6px;

    .result-display-title {
      font-weight: bold;
    }

    .result-toolBar {
      padding-top: 6px;
      padding-bottom: 6px;
      display: flex;
      align-items: center;

      .toolBar-play {
        height: 30px;
        width: 30px;
        color: rgb(97, 189, 156);
      }

      .toolBar-play-desc {
        margin-left: 6px;
      }
    }

    .result-body {

      .result-item {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        .result-item-index {
          margin-left: 12px;
        }
        .result-item-info{
          margin-left: 14px;
          .result-item-title {

          }

          .result-item-otherInfo {
            font-size: 14px;
          }
        }

      }
    }
  }
}
</style>