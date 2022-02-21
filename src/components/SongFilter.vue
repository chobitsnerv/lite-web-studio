<script>
import { defineComponent, ref, computed, onMounted } from "vue";
export default defineComponent({
  name: "SongFilter",
});
</script>

<script setup>
import utils from "utils/utils.js";
import bus from "vue3-eventbus";
import ExplainTreatedPopUp from "popup/ExplainTreated.vue";

const props = defineProps({
  songListFiltered: Array,
});

const emit = defineEmits(["update:songListFiltered"]);

const songListOrg = ref(window.AudioLists.song_list);
const songCollection = ref(window.AudioLists.song_collection);
const showSongCollection = ref(false);
const showFilter = ref(false);
const filters = ref([
  {
    name: "artist",
    text: "演唱者",
    value: "--",
    options: window.FilterOptions.artist,
  },
  {
    name: "status",
    text: "演唱状态",
    value: "--",
    options: window.FilterOptions.status,
  },
  {
    name: "language",
    text: "语言",
    value: "--",
    options: window.FilterOptions.language,
  },
  {
    name: "month",
    text: "月份",
    value: "--",
    options: window.FilterOptions.month,
  },
  {
    name: "collection",
    text: "歌单",
    value: "--",
    options: window.FilterOptions.collection,
  },
  {
    name: "star",
    text: "星标",
    value: "--",
    options: window.FilterOptions.star,
  },
  {
    name: "has_audio",
    text: "是否有音频",
    value: "--",
    options: window.FilterOptions.has_audio,
  },
  {
    name: "order",
    text: "排序",
    value: "时间倒序",
    options: window.FilterOptions.order,
  },
]);
const search = ref({
  text: "",
  textForSearch: "",
  type: "搜索歌名",
  options: window.FilterOptions.search_type,
});
const useTreated = ref(window.Variables.use_treated);
const showExplain = ref(false);

const selfSongListFiltered = computed(() => {
  let _templist = songListOrg.value.slice();
  let filter = {};
  for (const item of filters.value) filter[item.name] = item.value;
  // 筛选歌单
  if (filter.collection !== "--")
    _templist = songCollection.value
      .find((c) => c.name === filter.collection)
      .list.slice();
  // 筛选演唱状态
  if (filter.status !== "--")
    _templist = _templist.filter((song) => song.status === filter.status);
  // 筛选语言
  if (filter.language !== "--")
    _templist = _templist.filter((song) => song.language === filter.language);
  // 筛选演唱者
  if (filter.artist !== "--") {
    _templist = _templist.filter((song) => {
      const _artistList = song.artist.split(",");
      return _artistList.findIndex((a) => a === filter.artist) !== -1;
    });
  }
  // 筛选月份
  if (filter.month !== "--")
    _templist = _templist.filter(
      (song) => song.date.substring(0, 7) === filter.month
    );
  // 筛选星标
  if (filter.star === "星标")
    _templist = _templist.filter(
      (song) =>
        window.AudioLists.love_list.findIndex((love) => song.id === love) !== -1
    );
  else if (filter.star === "非星标")
    _templist = _templist.filter(
      (song) =>
        window.AudioLists.love_list.findIndex((love) => song.id === love) === -1
    );
  // 筛选是否有音频
  if (filter.has_audio === "有音频")
    _templist = _templist.filter((song) => song.has_audio);
  else if (filter.has_audio === "无音频")
    _templist = _templist.filter((song) => !song.has_audio);
  // 筛选搜索
  if (search.value.textForSearch !== "") {
    if (search.value.type === "搜索歌名")
      _templist = _templist.filter(
        (song) =>
          song.name
            .toLowerCase()
            .search(search.value.textForSearch.toLowerCase()) !== -1
      );
    else {
      _templist = _templist.filter((song) => {
        const _text = search.value.textForSearch.toLowerCase();
        let _flag = false;
        _flag = _flag || song.name.toLowerCase().search(_text) !== -1;
        if (song.note !== "")
          _flag = _flag || song.note.toLowerCase().search(_text) !== -1;
        if (song.ref)
          _flag = _flag || song.ref.name.toLowerCase().search(_text) !== -1;
        if (song.ref_cut)
          _flag = _flag || song.ref_cut.name.toLowerCase().search(_text) !== -1;
        return _flag;
      });
    }
  }
  // 排序
  if (filter.order === "时间正序") _templist.reverse();
  return _templist;
});

const applySearch = (clear) => {
  if (clear) search.value.text = "";
  search.value.textForSearch = search.value.text.trim();
  filterChangeEvent();
};

const filterChangeEvent = () => {
  emit("update:songListFiltered", selfSongListFiltered.value);
};

const replaceCollection = (songList) => {
  bus.emit(
    "playlist-replace-event",
    songList.filter((s) => s.has_audio)
  );
  //this.$parent.$parent.$refs.player.playlist_replace();
};

const searchPressEnter = (event) => {
  applySearch(false);
  event.target.blur();
};

const changeUseTreated = () => {
  utils.saveSettings({
    use_treated: useTreated.value.value,
  });
};

onMounted(() => {
  bus.on("apply-search-event", applySearch);
  showSongCollection.value =
    !navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    ) || !window.matchMedia("(max-width: 799px)").matches;
});
</script>

<template>
  <div class="c-outer card">
    <div class="title title-filter">
      <div class="title">歌单</div>
      <div
        class="title-filter-expand"
        v-on:click="showSongCollection = !showSongCollection"
      >
        {{ showSongCollection ? "...收起" : "展开..." }}
      </div>
    </div>
    <div class="c-song-collection" v-show="showSongCollection">
      <div
        class="collection-item"
        v-for="collection in songCollection"
        v-bind:key="collection.name"
        v-on:click="replaceCollection(collection.list)"
      >
        <img src="/node_modules/bootstrap-icons/icons/tag.svg" />
        <div>{{ collection.name }}</div>
      </div>
    </div>
    <hr />
    <div class="title title-filter">
      <div class="title">筛选</div>
      <div class="title-filter-expand" v-on:click="showFilter = !showFilter">
        {{ showFilter ? "...收起" : "展开..." }}
      </div>
    </div>
    <div class="c-filter" v-show="showFilter">
      <div
        class="filter-item"
        v-for="filter_item in filters"
        v-bind:key="filter_item.name"
      >
        <div class="filter-item-label">{{ filter_item.text }}:</div>
        <select
          class="general-input"
          v-model="filter_item.value"
          v-on:change="filterChangeEvent"
        >
          <option
            v-for="option in filter_item.options"
            v-bind:value="option"
            v-bind:key="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <div class="filter-item">
        <input
          id="filter-checkbox-treated"
          class="general-checkbox"
          type="checkbox"
          v-model="useTreated.value"
          v-on:change="changeUseTreated"
        />
        <label
          for="filter-checkbox-treated"
          class="filter-item-label filter-item-treated"
          >听经过处理的歌</label
        >
        <div class="filter-item-question" v-on:click="showExplain = true"></div>
      </div>
    </div>
    <div class="filter-song-search">
      <select
        class="general-input filter-song-search-select"
        v-model="search.type"
      >
        <option
          v-for="option in search.options"
          v-bind:value="option"
          v-bind:key="option"
        >
          {{ option }}
        </option>
      </select>
      <input
        v-model="search.text"
        class="general-input filter-song-search-input"
        v-on:keydown.enter="searchPressEnter"
        v-on:keydown.space.stop=""
      />
      <button
        class="general-button filter-song-search-go filter-song-search-button"
        v-on:click="applySearch(false)"
      >
        搜索!
      </button>
      <button
        class="general-button filter-song-search-clear filter-song-search-button"
        v-on:click="applySearch(true)"
      >
        清空
      </button>
    </div>
    <ExplainTreatedPopUp
      v-if="showExplain"
      v-on:closepopup="showExplain = false"
    />
  </div>
</template>

<style scoped>
@import "styles/songfilter.scss";
</style>
