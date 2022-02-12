<script>
import { defineComponent, ref, computed } from "vue";
export default defineComponent({
  name: "MainSongList",
});
</script>

<script setup>
import utils from "utils/utils.js";
import bus from "vue3-eventbus";
//import SongFilter from "./SongFilter.vue";
//import SongListPagination from "./SongListPagination.vue";

const loveList = ref(window.AudioLists.love_list);
const expandList = ref([]);
const page = ref(1);
const perPage = ref(10);
const songListFiltered = ref(window.AudioLists.song_list);
const playlist = ref(window.AudioLists.playlist);
const header = ref(null);

const songList = computed(() => {
  // 从筛选过后的列表中选出当前页的歌
  return songListFiltered.value.slice(
    (page.value - 1) * perPage.value,
    page.value * perPage.value
  );
});

const inPlaylistList = computed(() => {
  return songList.value.map(
    (s) => playlist.value.findIndex((song) => song.id === s.id) !== -1
  );
});

const isLoved = computed(() => {
  return songList.value.map(
    (song) => songList.value.findIndex((love) => song.id === love) !== -1
  );
});

const isExpanded = computed(() => {
  return songList.value.map(
    (song) => expandList.value.findIndex((expend) => song.id === expend) !== -1
  );
});

const addSong = (idx, shouldPlay = false) => {
  if (songList.value[idx].have_audio === false) return;
  bus.emit("playlist-add-song-event", [
    songList.value[idx],
    shouldPlay,
    shouldPlay,
  ]);
  //this.$parent.$refs.player.playlist_add_song();
};

const removeSong = (idx) => {
  // 这里怎么定位到播放器组件 我完全哇嘎那一
  bus.emit("playlist-remove-song-id-event", songList.value[idx].id);
  //this.$parent.$refs.player.playlist_remove_song_id(this.song_list[idx].id);
};

const loveSong = (idx) => {
  const _song = songList.value[idx];
  // 修改喜爱列表
  if (isLoved.value[idx]) {
    const _idxDel = loveList.value.findIndex((i) => _song.id === i);
    loveList.value.splice(_idxDel, 1);
  } else loveList.value.push(_song.id);
  // 保存喜爱列表
  utils.saveLoveList(loveList.value);
};

const expandSong = (idx) => {
  const _song = songList.value[idx];
  // 修改展开列表
  if (isExpanded.value[idx]) {
    const _idxDel = expandList.value.findIndex((i) => _song.id === i);
    expandList.value.splice(_idxDel, 1);
  } else expandList.value.push(_song.id);
};

const allSongToPlaylist = () => {
  // 当前筛选的全部歌曲，加入歌单
  if (songListFiltered.value.length > 0)
    bus.emit(
      "playlist-add-many-event",
      songListFiltered.value.filter((song) => song.have_audio)
    );
  //this.$parent.$refs.player.playlist_add_many()
};

const expendAll = () => {
  // 展开全部 如果没有全部展开就展开 否则收起
  if (expandList.value.length !== songList.value.length)
    expandList.value = songList.value.map((song) => song.id);
  else expandList.value = [];
};

const pageChangeEvent = () => {
  // 清空展开和选中
  checkList.value = [];
  expandList.value = [];
  // 判断是不是在页面内并滚动到顶部
  if (header.getBoundingClientRect().bottom < 0) header.scrollIntoView();
};
</script>

<template>
  <div class="c-main">
    <!--     <song-filter
      v-bind:songListFiltered.sync="songListFiltered"
      v-on:update:songListFiltered="page = 1"
    /> -->
    <div class="c-controler">
      <button
        class="general-button controler-item controler-item-all"
        v-on:click="allSongToPlaylist"
      >
        全部筛选结果加入播放列表
      </button>
    </div>
    <div class="c-song-list">
      <div class="song-list-header" ref="header">
        <div class="header-column all-column all-column-idx"></div>
        <div class="header-column header-column-op all-column all-column-op">
          操作
        </div>
        <div class="all-column-info">
          <div
            class="header-column header-column-name all-column all-column-name"
          >
            <span class="header-column-name-wide">歌名</span>
            <span class="header-column-name-narrow">歌曲信息</span>
          </div>
          <div
            class="header-column header-column-artist all-column all-column-artist"
          >
            演唱者
          </div>
          <div
            class="header-column header-column-status all-column all-column-status"
          >
            演唱状态
          </div>
          <div
            class="header-column header-column-date all-column all-column-date"
          >
            演唱日期
          </div>
          <div
            class="header-column header-column-duration all-column all-column-duration"
          >
            时长
          </div>
        </div>
        <div
          class="header-column header-column-details all-column all-column-details"
          v-on:click="expendAll"
        >
          展开
        </div>
      </div>
      <div
        v-bind:class="[
          'song-list-item',
          { 'dark-bg': idx % 2 === 1 },
          { 'light-bg': idx % 2 === 0 },
        ]"
        v-for="(song, idx) in songList"
        v-bind:key="song.id"
      >
        <div class="song-list-item-main">
          <div class="item-column-idx all-column all-column-idx">
            {{ idx + 1 + (page - 1) * perPage }}
          </div>
          <div class="item-column-op all-column all-column-op">
            <div
              class="item-op-download item-op-all"
              title="下载歌曲"
              v-show="song.have_audio"
            >
              <a v-bind:href="song.src" download><div></div></a>
            </div>
            <div
              class="item-op-add item-op-all"
              title="加入播放列表"
              v-show="song.have_audio && !inPlaylistList[idx]"
              v-on:click.stop="addSong(idx)"
            >
              <div></div>
            </div>
            <div
              class="item-op-added item-op-all"
              title="已在播放列表"
              v-show="song.have_audio && inPlaylistList[idx]"
              v-on:click.stop="removeSong(idx)"
            >
              <div></div>
            </div>
            <div
              class="item-op-star item-op-all"
              title="星标歌曲"
              v-show="song.have_audio"
              v-on:click.stop="loveSong(idx)"
            >
              <div
                v-bind:class="[
                  { 'item-op-star-true': isLoved[idx] },
                  { 'item-op-star-false': !isLoved[idx] },
                ]"
              ></div>
            </div>
            <div class="item-op-none" v-show="!song.have_audio">
              {{
                song.days_before_available > 0
                  ? song.days_before_available + "天后可听"
                  : "暂无音频"
              }}
            </div>
          </div>
          <div
            class="all-column-info item-column-info"
            v-on:click="addSong(idx, true)"
          >
            <div class="song-name all-column all-column-name">
              {{ song.name }}
            </div>
            <div class="song-info-artist">
              <div class="song-artist all-column all-column-artist">
                {{ song.artist }}
              </div>
              <div class="song-status all-column all-column-status">
                {{ song.status }}
              </div>
            </div>
            <div class="song-info-date">
              <div class="song-date all-column all-column-date">
                {{ song.date }}
              </div>
              <div class="song-duration all-column all-column-duration">
                {{ song.duration }}
              </div>
            </div>
          </div>
          <div
            class="item-column-details all-column all-column-details"
            v-on:click.stop="expandSong(idx)"
          >
            {{ isExpanded[idx] ? "...收起" : "详细..." }}
          </div>
        </div>
        <div class="song-list-item-details" v-show="isExpanded[idx]">
          <div class="song-full-details-language">
            语言: {{ song.language }}
          </div>
          <div
            class="song-full-details-orginal"
            v-show="song.orginal_artist !== ''"
          >
            原唱: {{ song.orginal_artist }}
          </div>
          <div class="song-full-details-ref" v-show="song.ref !== false">
            参考的路灯man:
            <a
              v-bind:href="'https://space.bilibili.com/' + song.ref.uid"
              target="_blank"
              rel="noreferrer noopener"
            >
              @{{ song.ref.name }}
            </a>
          </div>
          <div class="song-full-details-record">
            <span>录播：</span>
            <a
              v-bind:href="
                'https://www.bilibili.com/video/' +
                song.record.bv +
                '?p=' +
                song.record.p +
                '&start_progress=' +
                song.record_start_ms
              "
              target="_blank"
              rel="noreferrer noopener"
            >
              {{ song.date }} p{{ song.record.p }} {{ song.record.timecode }}
            </a>
          </div>
          <div class="song-full-details-note" v-show="song.note !== ''">
            切歌man的留言: {{ song.note }}
          </div>
          <div
            class="song-full-details-ref-cut"
            v-show="song.ref_cut !== false"
          >
            音频提供:
            <a
              v-bind:href="'https://space.bilibili.com/' + song.ref_cut.uid"
              target="_blank"
              rel="noreferrer noopener"
            >
              @{{ song.ref_cut.name }}
            </a>
          </div>
        </div>
      </div>
      <div v-show="songList.length === 0" class="song-list-no-item">
        无结果...
      </div>
    </div>
    <!--     <song-list-pagination
      v-bind:page.sync="page"
      v-bind:perPage.sync="perPage"
      v-bind:total="songListFiltered.length"
      v-on:update:page="pageChangeEvent"
    ></song-list-pagination> -->
  </div>
</template>

<style scoped>
@import "styles/mainsonglist.scss";
</style>
