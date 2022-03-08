<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  onMounted,
} from "vue";
export default defineComponent({
  name: "AudioPlayer",
});
</script>

<script setup>
import utils from "utils/utils";
import Consts from "globals/consts.js";
import bus from "vue3-eventbus";
import draggable from "vuedraggable";
import SharePopUp from "popup/Share.vue";
import DetailsPopUp from "popup/Details.vue";

let audio = {};
let audioSource = {};
const showPlaylist = ref(false);
const showVolumeBar = ref(false);
const showShare = ref(false);
const showDetails = ref(false);
const playStatus = ref(false);
const audioLoading = ref(false);
const autoPlay = ref(false);
const isPlaylistEditable = ref(false);
const playMode = ref("loop");
const volume = ref(0.9);
const playProgress = ref(0);
const loadProgress = ref(0);
const duration = ref(0);
const currentSongIndex = ref(0);
const currentSongID = ref("");
const playlist = ref(window.AudioLists.playlist);
const loveList = ref(window.AudioLists.love_list);
const volumebarref = ref(null);
const playlistref = ref(null);
const playlistcontentref = ref(null);
const playlistbuttonref = ref(null);

// 滑动检测
let isMouseDown = false;
window.addEventListener("mouseup", () => {
  if (isMouseDown === true) isMouseDown = false;
});

// const playlistWithoutEmpty = computed(() => {
//   return playlist.value.filter((s) => {
//     return s.id !== "empty_song";
//   });
// });

const volumeHeight = computed(() => {
  return {
    height: String((1 - volume.value) * 100) + "%",
  };
});

const progressBarFillWidth = computed(() => {
  return {
    width: String(playProgress.value * 100) + "%",
  };
});

const progressBarLoadingWidth = computed(() => {
  return {
    width: String(loadProgress.value * 100) + "%",
  };
});

const progressBarButtonLeft = computed(() => {
  return {
    left: `calc(${playProgress.value * 100}% - 0.75rem)`,
  };
});

const playModeText = computed(() => {
  if (playMode.value === "loop") return "listLoop";
  if (playMode.value === "loopOnce") return "songLoop";
  return "shuffle";
});

const playlistLength = computed(() => {
  if (playlist.value[0].id === "empty_song") return 0;
  else return playlist.value.length;
});

const isLoved = computed(() => {
  // 空列表就返回否
  if (playlist.value[0].id === "empty_song") return false;
  const id = playlist.value[currentSongIndex.value].id;
  if (loveList.value.findIndex((i) => id === i) !== -1) return true;
  return false;
});

const currentSongObject = computed(() => {
  return playlist.value[currentSongIndex.value];
});

const dragOptions = computed(() => {
  return {
    animation: 0,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };
});

watch(volume, (newV) => {
  if (newV) {
    audio.volume = newV;
  }
});

watch([currentSongIndex, () => [...playlist.value]], (newValues) => {
  utils.savePlaylist(newValues[0], newValues[1]);
});

const secondToText = (second) => {
  second = Math.floor(second);
  let _minute = String(Math.floor(second / 60));
  let _second = String(second % 60);
  if (_minute.length === 1) _minute = "0" + _minute;
  if (_second.length === 1) _second = "0" + _second;
  return `${_minute}:${_second}`;
};

const switchPlayMode = () => {
  if (playMode.value === "loop") playMode.value = "loopOnce";
  else if (playMode.value === "loopOnce") playMode.value = "shuffle";
  else if (playMode.value === "shuffle") playMode.value = "loop";
  utils.saveSettings({ play_mode: playMode.value });
};

const volumeBarMouseEvent = (event) => {
  // 判断是否按键
  if (event.buttons !== 0) {
    const _target = document.getElementById("c-volumeBarRaw");
    const _percent =
      (event.clientY - _target.getBoundingClientRect().top) /
      _target.clientHeight;
    setVolume(1 - _percent);
  }
};

const volumeBarTouchEvent = (event) => {
  const _target = document.getElementById("c-volumeBarRaw");
  const _percent =
    (event.targetTouches[0].clientY - _target.getBoundingClientRect().top) /
    _target.clientHeight;
  setVolume(1 - _percent);
};

const progressBarMouseEvent = (event) => {
  const _target = document.getElementById("c-progressBarRaw");
  const _percent =
    (event.clientX - _target.getBoundingClientRect().left) /
    _target.clientWidth;
  setPlayProgress(Math.max(Math.min(_percent, 1), 0));
};

const progressBarTouchEvent = (event) => {
  const _target = document.getElementById("c-progressBarRaw");
  const _percent =
    (event.targetTouches[0].clientX - _target.getBoundingClientRect().left) /
    _target.clientWidth;
  setPlayProgress(Math.max(Math.min(_percent, 1), 0));
};

const progressBarButtonMouseEvent = (event) => {
  event.stopPropagation();
  isMouseDown = true;
};

const toggleShare = () => {
  if (playlist.value[currentSongIndex.value].id !== "empty_song")
    showShare.value = !showShare.value;
};

const toggleDetails = () => {
  if (playlist.value[currentSongIndex.value].id !== "empty_song")
    showDetails.value = !showDetails.value;
};

const applySong = async () => {
  audioLoading.value = false;
  if (currentSongObject.value.id === "empty_song") return false;
  let _src = null;
  //加载歌曲，先查看是否有缓存过，有的话从换从加载
  if (window.AudioLists.cached_list.includes(currentSongObject.value.id)) {
    const _songFile = await utils.getAudioInDB(currentSongObject.value.id);
    const _URL = window.URL || window.webkitURL;
    _src = _URL.createObjectURL(_songFile?.blobcached);
  } else {
    // 加载当前歌曲 如果是精选状态且有精选版本就跳精选
    _src = currentSongObject.value.src;
    if (window.Variables.use_treated.value) {
      const _secondSrc = currentSongObject.value.secondSrc;
      if (_secondSrc !== "") _src = _secondSrc;
    }
  }
  audioSource.src = _src;
  audio.load();
  // 播放列表跳转
  if (showPlaylist.value) playlistScroll();
  // 更改media session信息
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: currentSongObject.value.name,
      artist: currentSongObject.value.artist,
      album: "",
      artwork: [{ src: "../assets/logo.png" }],
    });
  }
  audio.title = currentSongObject.value.name;
  currentSongID.value = currentSongObject.value.id;
  // 保存当前歌单
  //utils.savePlaylist(currentSongIndex.value, playlist.value);
};

const audioTogglePlay = () => {
  // 播放列表不为空
  if (playlist.value[0].id !== "empty_song") {
    playStatus.value = !audio.paused;
    if (playStatus.value) audio.pause();
    else audio.play();
  }
};

const audioPause = () => {
  // 正在播放就暂停
  playStatus.value = !audio.paused;
  if (playStatus.value) audio.pause();
};

const nextSong = (idx) => {
  // 如果列表是空的就return
  if (playlist.value[0].id === "empty_song") return;
  // 如果当前正在播放，就自动播放下一首
  autoPlay.value = playStatus.value;
  // 只有一首歌就回到开头
  if (playlist.value.length === 1) {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  if (playMode.value === "loop" || playMode.value === "loopOnce") {
    // 列表循环和单曲循环就下一首
    currentSongIndex.value += idx;
    if (currentSongIndex.value < 0)
      currentSongIndex.value += playlist.value.length;
    currentSongIndex.value %= playlist.value.length;
  } else if (playMode.value === "shuffle") {
    // 随机就随机一首歌
    currentSongIndex.value = randomSong();
  }
  // 加载这首歌
  applySong();
};

const changeSong = (idx) => {
  autoPlay.value = true;
  currentSongIndex.value = idx;
  applySong();
};

const playerMouseEvent = (event) => {
  // 按键才执行
  if (isMouseDown) {
    progressBarMouseEvent(event);
  }
};

const setPlayProgress = (progress) => {
  if (audio.duration > 0) {
    audio.currentTime = Math.max(progress * audio.duration - 0.05, 0);
    playProgress.value = progress;
  }
};

const setVolume = (value) => {
  value = Math.min(1, Math.max(0, value));
  volume.value = value;
  utils.saveSettings({ play_volume: value });
};

const randomSong = () => {
  // 随机一个数，如果是当前曲子就重新随机
  let r;
  do {
    r = Math.floor(Math.random() * playlist.value.length);
  } while (r === currentSongIndex.value);
  return r;
};

const toggleLoved = () => {
  if (playlist.value[0].id === "empty_song") return;
  const id = playlist.value[currentSongIndex.value].id;
  // 切换状态
  if (isLoved.value) {
    // 修改喜爱列表
    const idx = loveList.value.findIndex((i) => id === i);
    loveList.value.splice(idx, 1);
  } else {
    // 修改喜爱列表
    loveList.value.push(playlist.value[currentSongIndex.value].id);
  }
  // 保存喜爱列表
  utils.saveLoveList(loveList.value);
};

const playlistClear = () => {
  audioPause();
  playlist.value.splice(0, playlist.value.length);
  playlist.value.push(Consts.empty_song);
  currentSongIndex.value = 0;
  playStatus.value = false;
  playProgress.value = 0;
  loadProgress.value = 0;
  duration.value = 0;
  audioSource.src = "";
  audio.load();
  // 保存当前歌单
  //utils.savePlaylist(currentSongIndex.value, playlist.value);
};

const playlistRemoveSong = (idx) => {
  // 如果只剩一首歌 就相当于清空列表
  if (playlist.value.length === 1) {
    playlistClear();
    return;
  }
  // 如果删除的歌是现在选中的歌（至少剩了一首）
  if (idx === currentSongIndex.value) {
    // 把正在播放的切到下一首歌并暂停播放
    currentSongIndex.value += 1;
    currentSongIndex.value %= playlist.value.length;
    autoPlay.value = false;
    playStatus.value = false;
    applySong();
  }
  // 先获取当前播放的id
  const _currentSongID = playlist.value[currentSongIndex.value].id;
  // 删除选中的歌
  playlist.value.splice(idx, 1);
  // 重新获取当前歌index
  currentSongIndex.value = playlist.value.findIndex((song) => {
    return song.id === _currentSongID;
  });
  // 保存当前歌单
  //utils.savePlaylist(currentSongIndex.value, playlist.value);
};

const playlistRemoveSongID = (id) => {
  // 根据id找到对应的下标删歌
  const idx = playlist.value.findIndex((s) => s.id === id);
  if (idx === -1) return;
  playlistRemoveSong(idx);
};

const playlistAddSong = (song, isJump = false, isAutoplay = false) => {
  let _setSrc = false;
  if (playlist.value[0].id === "empty_song") {
    // 如果播放列表是空的就清空列表
    playlist.value.splice(0, playlist.value.length);
    _setSrc = true;
  }
  // 判断歌曲是否重复
  let idx = playlist.value.findIndex((s) => {
    return s.id === song.id;
  });
  if (idx === -1) {
    // 如果不重复
    playlist.value.push(song);
    // 保存当前歌单
    //utils.savePlaylist(currentSongIndex.value, playlist.value);
    idx = playlist.value.length - 1;
  }
  //
  // 原来播放列表是空的 或者 要求跳转 就跳转到歌曲
  if (_setSrc || isJump) {
    // 如果要求跳转就自动播放
    autoPlay.value = isAutoplay;
    currentSongIndex.value = idx;
    applySong();
  }
};

const playlistAddMany = (songs) => {
  if (songs.length === 0) return false;
  // 如果播放列表是空的
  let _shouldSetSrc = false;
  if (playlist.value[0].id === "empty_song") {
    // 清空列表
    playlist.value.splice(0, playlist.value.length);
    _shouldSetSrc = true;
  }
  // 遍历所有要添加的歌
  let added = false;
  for (const song of songs) {
    // 判断歌曲是否重复
    const idx = playlist.value.findIndex((s) => {
      return s.id === song.id;
    });
    if (idx === -1) {
      playlist.value.push(song);
      added = true;
    }
  }
  // 原来播放列表是空的且添加过歌就设置src并暂停
  if (_shouldSetSrc && added) {
    applySong();
    autoPlay.value = false;
  }
  // 保存当前歌单
  //utils.savePlaylist(currentSongIndex.value, playlist.value);
  return added;
};

const playlistReplace = (newlist, currentSongidx = 0) => {
  // 更换歌单后暂停播放
  playlist.value.splice(0, playlist.value.length);
  for (const song of newlist) playlist.value.push(song);
  currentSongIndex.value = currentSongidx;
  autoPlay.value = false;
  playStatus.value = false;
  applySong();
};

const playlistShare = () => {
  // 输出歌单中歌曲的id列表
  return playlist.value.map((s) => s.id);
};

const playlistScroll = () => {
  // 滚动播放列表到当前歌曲
  playlistcontentref.value.children[0].children[
    currentSongIndex.value
  ].scrollIntoView({
    block: "nearest",
  });
};

const updateCurrentSongIndex = (evt) => {
  const _actualCurrentSongIndex = playlist.value.findIndex(
    (song) => song.id === currentSongID.value
  );
  if (_actualCurrentSongIndex !== currentSongIndex.value)
    currentSongIndex.value = _actualCurrentSongIndex;
};

onMounted(() => {
  audio = document.getElementById("lite_player");
  audioSource = document.getElementById("lite_player_source");
  audio.volume = 0.9;
  audio.addEventListener("loadedmetadata", () => {
    duration.value = audio.duration;
    playProgress.value = 0;
  });
  audio.addEventListener("loadeddata", () => {
    duration.value = audio.duration;
    playProgress.value = 0;
  });
  audio.addEventListener("canplay", () => {
    //console.log('可以播放了')
    if (autoPlay.value) audio.play();
  });
  audio.addEventListener("progress", () => {
    if (audio.duration > 0 && audio.buffered.length > 0) {
      loadProgress.value =
        audio.buffered.end(audio.buffered.length - 1) / audio.duration;
    }
  });
  audio.addEventListener("waiting", () => (audioLoading.value = true));
  audio.addEventListener("playing", () => (audioLoading.value = false));
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) playProgress.value = audio.currentTime / audio.duration;
    else playProgress.value = 0;
  });
  audio.addEventListener("play", () => {
    playStatus.value = true;
  });
  audio.addEventListener("pause", () => {
    playStatus.value = false;
  });
  audio.addEventListener("ended", () => {
    // 结束后自动播放下一首
    autoPlay.value = true;
    // 如果只有一首或者是单曲循环就回到开头
    if (playlist.value.length === 1 || playMode.value === "loopOnce") {
      audio.currentTime = 0;
      audio.play();
      return;
    }
    if (playMode.value === "loop") {
      // 列表循环
      currentSongIndex.value += 1;
      currentSongIndex.value %= playlist.value.length;
    } else if (playMode.value === "shuffle") {
      currentSongIndex.value = randomSong();
    }
    // 加载歌曲
    applySong();
  });
  // media session支持
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", () => {
      utils.debug("通过media session播放");
      audioTogglePlay();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      utils.debug("通过media session暂停");
      audioTogglePlay();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      utils.debug("通过media session上一曲");
      nextSong(-1);
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      utils.debug("通过media session下一曲");
      nextSong(1);
    });
  }
  // 空格键播放/暂停
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.isComposing) {
      audioTogglePlay();
      e.preventDefault();
    }
  });
  //点击空白关闭弹出的组件
  document.addEventListener("click", (e) => {
    if (!volumebarref.value.contains(e.target)) {
      showVolumeBar.value = false;
    }
    if (
      !playlistref.value.contains(e.target) &&
      !playlistbuttonref.value.contains(e.target)
    ) {
      showPlaylist.value = false;
    }
  });

  // 自动加载第一首
  applySong();
  window.audio = audio;

  bus.on("playlist-add-song-event", (para) => {
    playlistAddSong(...para);
  });

  bus.on("playlist-remove-song-id-event", (para) => {
    playlistRemoveSongID(para);
  });

  bus.on("playlist-add-many-event", (para) => {
    playlistAddMany(para);
  });

  bus.on("playlist-replace-event", (para) => {
    if (para.length > 0) {
      playlistReplace(para);
    }
  });

  bus.on("player-audio-pause", audioPause);
});

//公开属性给到父组件
defineExpose({
  playMode,
  volume,
  playlistReplace,
  playlistAddSong,
  playlistAddMany,
});
</script>

<template>
  <div id="player">
    <div class="c-player" v-on:mousemove="playerMouseEvent">
      <div class="c-info">
        <div class="c-songInfo">
          <div class="c-songName">
            <div class="songName" v-if="playlist[currentSongIndex]">
              {{ playlist[currentSongIndex].name
              }}{{
                playlist[currentSongIndex].name_chs
                  ? `(${playlist[currentSongIndex].name_chs})`
                  : ""
              }}
            </div>
            <div class="singer">
              {{ playlist[currentSongIndex]?.artist }}
            </div>
          </div>
          <div class="c-songStatus">
            <div class="date">
              {{ playlist[currentSongIndex]?.date }}
            </div>
            <div class="songStatus">
              {{ playlist[currentSongIndex]?.status }}
            </div>
          </div>
        </div>
        <div class="c-info-op">
          <div class="shareButton otherButtons" v-on:click="toggleShare">
            <div class="toggleShareIcon" />
          </div>
          <div class="detailsButton otherButtons" v-on:click="toggleDetails">
            <div class="toggleDetailsIcon" />
          </div>
        </div>
      </div>
      <div class="c-control">
        <div class="c-controlButtons">
          <div class="c-otherButtons">
            <div
              class="playModeButton otherButtons"
              v-on:click="switchPlayMode"
              v-bind:title="$t(playMode)"
            >
              <div class="loopIcon" v-show="playMode == 'loop'" />
              <div class="loopOnceIcon" v-show="playMode == 'loopOnce'" />
              <div class="shuffleIcon" v-show="playMode == 'shuffle'" />
            </div>
            <div ref="volumebarref">
              <div
                class="volumeButton otherButtons"
                v-on:click="showVolumeBar = !showVolumeBar"
                :title="$t('volume')"
              >
                <div class="volumeIcon" />
              </div>
              <transition name="fade">
                <div class="c-volumeBar" v-show="showVolumeBar">
                  <div
                    class="c-volumeBarRaw"
                    id="c-volumeBarRaw"
                    v-on:mousedown="volumeBarMouseEvent"
                    v-on:mousemove="volumeBarMouseEvent"
                    v-on:touchmove.prevent="volumeBarTouchEvent"
                  >
                    <div
                      class="volumeBar-invert"
                      v-bind:style="volumeHeight"
                    ></div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="c-playButtons">
            <div
              class="prevButton playButtons"
              v-on:click="nextSong(-1)"
              :title="$t('previousSong')"
            >
              <div></div>
            </div>
            <div
              class="playButton playButtons"
              v-on:click="audioTogglePlay"
              :title="$t('playButton')"
            >
              <div
                v-bind:class="[
                  { 'playButton-play': !playStatus },
                  { 'playButton-pause': playStatus },
                  { 'playButton-loading': audioLoading },
                ]"
              ></div>
            </div>
            <div
              class="nextButton playButtons"
              v-on:click="nextSong(1)"
              :title="$t('nextSong')"
            >
              <div></div>
            </div>
          </div>
          <div class="c-otherButtons">
            <div
              class="loveButton otherButtons"
              v-on:click="toggleLoved"
              :title="$t('favoriteSong')"
            >
              <div v-show="!isLoved" class="isLovedOff" />
              <div v-show="isLoved" class="isLovedOn" />
            </div>
            <div
              class="playlistButton otherButtons"
              v-on:click="showPlaylist = !showPlaylist"
              :title="$t('playList')"
              ref="playlistbuttonref"
            >
              <div class="playlistButton-img"></div>
              <div class="playlistButton-corner">{{ playlistLength }}</div>
            </div>
          </div>
        </div>
        <div class="c-progressBarText">
          <div class="currentTime">
            {{ secondToText(playProgress * duration) }}
          </div>
          <div class="c-progressBar">
            <div
              class="progressBar-button"
              v-bind:style="progressBarButtonLeft"
              v-on:mousedown="progressBarButtonMouseEvent"
              v-on:touchmove.prevent="progressBarTouchEvent"
            ></div>
            <div
              class="c-progressBarRaw"
              id="c-progressBarRaw"
              v-on:mousedown="progressBarMouseEvent"
              v-on:touchmove.prevent="progressBarTouchEvent"
            >
              <div
                class="progressBar-fill"
                v-bind:style="progressBarFillWidth"
              ></div>
              <div
                class="progressBar-loading"
                v-bind:style="progressBarLoadingWidth"
              ></div>
            </div>
          </div>
          <div class="duration">{{ secondToText(duration) }}</div>
        </div>
      </div>
    </div>
    <transition name="fade" v-on:enter="playlistScroll">
      <div class="c-playlist" v-show="showPlaylist" ref="playlistref">
        <div class="c-playlist-title">
          <div class="playlist-clearAll">
            <span v-on:click="playlistClear">{{ $t("empty") }}</span>
          </div>
          <div class="playlist-title">{{ $t("playList") }}</div>
          <div class="playlist-close">
            <span
              v-on:click="isPlaylistEditable = !isPlaylistEditable"
              v-show="!isPlaylistEditable"
              >{{ $t("edit") }}</span
            >
            <span
              v-on:click="isPlaylistEditable = !isPlaylistEditable"
              v-show="isPlaylistEditable"
              >{{ $t("done") }}</span
            >
          </div>
        </div>
        <div class="c-playlist-songList" ref="playlistcontentref">
          <draggable
            v-bind="dragOptions"
            :disabled="!isPlaylistEditable"
            @start="drag = true"
            @end="drag = false"
            v-model="playlist"
            item-key="id"
            tag="transition-group"
            handle=".handle"
            :component-data="{
              tag: 'div',
              name: 'flip-list',
              type: 'transition',
            }"
            @change="updateCurrentSongIndex"
          >
            <template #item="{ element, index }">
              <div
                v-bind:class="[
                  'c-playlist-song',
                  {
                    'c-playlist-playing':
                      element.id === playlist[currentSongIndex]?.id,
                  },
                ]"
                v-show="playlist[0]?.id !== 'empty_song'"
                v-on:click="changeSong(index)"
              >
                <Transition duration="450" name="shadowleft">
                  <div
                    class="playlist-draggable-icon handle"
                    v-if="isPlaylistEditable === true"
                  />
                  <div
                    class="playlist-index"
                    v-else-if="isPlaylistEditable === false"
                  >
                    {{ index + 1 }}.
                  </div>
                </Transition>

                <div class="playlist-name handle">
                  {{ element.name }}
                </div>
                <div class="playlist-dash">-</div>
                <div class="playlist-artist">{{ element.artist }}</div>
                <div class="playlist-status">{{ element.status }}</div>
                <div class="playlist-duration">{{ element.duration }}</div>
                <Transition duration="550" name="shadowright">
                  <div
                    class="playlist-clear"
                    v-on:click.stop="playlistRemoveSong(index)"
                    v-show="isPlaylistEditable"
                  >
                    <div class="playlist-clear-img"></div>
                  </div>
                </Transition>
              </div>
            </template>
          </draggable>
          <!-- <div
            v-for="(song, index) in playlistWithoutEmpty"
            v-bind:class="[
              'c-playlist-song',
              {
                'c-playlist-playing':
                  song.id === playlist[currentSongIndex]?.id,
              },
            ]"
            v-bind:key="song.id"
            v-on:click="changeSong(index)"
          >
            <div class="playlist-name">
              <span class="playlist-index">{{ index + 1 }}. </span
              >{{ song.name }}
            </div>
            <div class="playlist-dash">-</div>
            <div class="playlist-artist">{{ song.artist }}</div>
            <div class="playlist-status">{{ song.status }}</div>
            <div class="playlist-duration">{{ song.duration }}</div>
            <div
              class="playlist-clear"
              v-on:click.stop="playlistRemoveSong(index)"
            >
              <div class="playlist-clear-img"></div>
            </div>
          </div> -->
          <div class="playlist-empty" v-show="playlist[0]?.id === 'empty_song'">
            {{ $t("playListEmpty") }}
          </div>
        </div>
      </div>
    </transition>
    <SharePopUp
      v-if="showShare"
      v-on:closepopup="showShare = false"
      :song="playlist[currentSongIndex]"
    />
    <DetailsPopUp
      v-if="showDetails"
      v-on:closepopup="showDetails = false"
      :song="playlist[currentSongIndex]"
    />
    <audio id="lite_player">
      <source id="lite_player_source" src="" type="audio/mpeg" />
    </audio>
  </div>
</template>

<style scoped>
@import "@/styles/audioplayer.scss";
</style>
