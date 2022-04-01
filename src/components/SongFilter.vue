<script>
import { defineComponent, ref, computed, onMounted, reactive } from "vue";
export default defineComponent({
  name: "SongFilter",
});
</script>

<script setup>
import utils from "utils/utils.js";
import bus from "vue3-eventbus";
import ExplainTreatedPopUp from "popup/ExplainTreated.vue";
import intersection from "lodash.intersection";
import shuffle from "lodash.shuffle";

const props = defineProps({
  songListFiltered: Array,
  cachedList: Array,
  loveList: Array,
});

const emit = defineEmits(["update:songListFiltered"]);

const songListOrg = ref(window.AudioLists.song_list);
const songCollection = ref(window.AudioLists.song_collection);
const showSongCollection = ref(false);
const showFilter = ref(false);
const useTreated = ref(window.Variables.use_treated.value);
const showExplain = ref(false);
const artistExactMacth = ref(false);
const filters = reactive([
  {
    name: "artist",
    text: "演唱者",
    value: "",
    options: window.FilterOptions.artist,
  },
  {
    name: "status",
    text: "演唱状态",
    value: "",
    options: window.FilterOptions.status,
  },
  {
    name: "language",
    text: "语言",
    value: "",
    options: window.FilterOptions.language,
  },
  {
    name: "month",
    text: "月份",
    value: "",
    options: window.FilterOptions.month,
  },
  {
    name: "collection",
    text: "歌单",
    value: "",
    options: window.FilterOptions.collection,
  },
  {
    name: "star",
    text: "星标",
    value: "",
    options: window.FilterOptions.star,
  },
  {
    name: "has_audio",
    text: "是否有音频",
    value: "",
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

const selfSongListFiltered = computed(() => {
  let _templist = songListOrg.value.slice();
  let filter = {};
  for (const item of filters) filter[item.name] = item.value;
  // 筛选歌单
  if (filter.collection !== "")
    _templist = songCollection.value
      .find((c) => c.name === filter.collection)
      .list.slice();
  // 筛选演唱状态
  if (filter.status !== "")
    _templist = _templist.filter((song) => song.status === filter.status);
  // 筛选语言
  if (filter.language !== "")
    _templist = _templist.filter((song) => song.language === filter.language);
  // 筛选演唱者
  if (filter.artist.length) {
    _templist = _templist.filter((song) => {
      const _artistList = song.artist.split(",");
      let _result = false;
      if (filter.artist.length === 1)
        _result =
          _artistList.findIndex((a) => filter.artist.includes(a)) !== -1;
      else
        _result =
          intersection(_artistList, filter.artist).length ===
          filter.artist.length;
      return artistExactMacth.value
        ? _result && _artistList.length == filter.artist.length
        : _result;
    });
  }
  // 筛选月份
  if (filter.month !== "")
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
  window.Variables.use_treated.value = useTreated.value;
  utils.saveSettings({
    use_treated: useTreated.value,
  });
};

const calculateSelectWidth = (list, mutipleflag) => {
  let _length = 4;
  if (list.length) {
    _length = [
      ...list.reduce((acc, val) => {
        return acc.length >= val.length ? acc : val;
      }),
    ].reduce((count, char) => count + Math.min(new Blob([char]).size, 2), 0);
  }
  return `width: ${Math.ceil(_length / 2) + (mutipleflag ? 11 : 4)}rem`;
};

const switchStylePicker = () => {
  return shuffle(["#9AC8E2", "#DB7D74", "#B8A6D9", "#E799B0", "#576690"])[0];
};

onMounted(() => {
  bus.on("apply-search-event", applySearch);
  showSongCollection.value = !window.Variables.is_mobile_device;
});
</script>

<template>
  <div class="c-outer card">
    <div class="title title-filter">
      <div class="title">{{ $t('songList') }}</div>
      <div
        class="title-filter-expand"
        v-on:click="showSongCollection = !showSongCollection"
      >
        {{ showSongCollection ? "..." + $t('collapse') : $t('expand') + "..." }}
      </div>
    </div>
    <div class="c-song-collection" v-show="showSongCollection">
      <div
        class="collection-item"
        v-for="collection in songCollection"
        v-bind:key="collection.name"
        v-on:click="replaceCollection(collection.list)"
      >
        <div class="collection-icon" />
        <div>{{ $t(collection.name) }}</div>
      </div>
      <div class="collection-item" v-on:click="replaceCollection(cachedList)">
        <div class="collection-icon" />
        <div>{{ $t('本地缓存') }}</div>
      </div>
      <div class="collection-item" v-on:click="replaceCollection(loveList)">
        <div class="collection-icon" />
        <div>{{ $t('已收藏') }}</div>
      </div>
    </div>
    <hr />
    <div class="title title-filter">
      <div class="title">{{ $t('filter') }}</div>
      <div class="title-filter-expand" v-on:click="showFilter = !showFilter">
        {{ showFilter ? "..." + $t('collapse') : $t('expand') + "..." }}
      </div>
    </div>
    <div class="c-filter" v-show="showFilter">
      <div
        class="filter-item"
        v-for="filter_item in filters"
        v-bind:key=filter_item.name
      >
        <div class="filter-item-label">
          <div>{{ $t(filter_item.name) }}:</div>
          <el-switch
            v-model="artistExactMacth"
            inline-prompt
            active-text="精确"
            inactive-text="模糊"
            :width="50"
            :active-color="switchStylePicker()"
            inactive-color="#FC966E"
            v-if="filter_item.name == 'artist'"
          />
        </div>
        <el-select
          v-model="filter_item.value"
          :multiple="filter_item.name == 'artist'"
          clearable
          placeholder="--"
          :style="
            calculateSelectWidth(
              filter_item.options,
              filter_item.name == 'artist'
            )
          "
        >
          <el-option
            v-for="option in filter_item.options"
<<<<<<< HEAD
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
=======
            v-bind:value="option"
            v-bind:key="option"
          >
            {{ $t(option) }}
          </option>
        </select>
>>>>>>> release2.0
      </div>
      <div class="filter-item">
        <input
          id="filter-checkbox-treated"
          class="general-checkbox"
          type="checkbox"
          v-model="useTreated"
          v-on:change="changeUseTreated"
        />
        <label
          for="filter-checkbox-treated"
          class="filter-item-label filter-item-treated"
          >{{ $t('processedSongs') }}</label
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
          {{ $t(option) }}
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
        {{ $t('search') }}
      </button>
      <button
        class="general-button filter-song-search-clear filter-song-search-button"
        v-on:click="applySearch(true)"
      >
        {{ $t('empty') }}
      </button>
    </div>
    <ExplainTreatedPopUp
      v-if="showExplain"
      v-on:closepopup="showExplain = false"
    />
  </div>
</template>

<style scoped>
@import "@/styles/songfilter.scss";
</style>
