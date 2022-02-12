<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "DetailsPopUp",
});
</script>

<script setup>
import MainPopUp from "popup/Main.vue";

const props = defineProps({
  song: Object,
});

const emit = defineEmits(["closepopup"]);
</script>

<template>
  <MainPopUp v-on:closepopup="$emit('closepopup')" title="歌曲详情">
    <div class="content">
      <p><span>歌名：</span>{{ props.song?.name }}</p>
      <p><span>演唱者：</span>{{ props.song?.artist }}</p>
      <p><span>演唱状态：</span>{{ props.song?.status }}</p>
      <p v-if="props.song?.orginal_artist !== ''">
        <span>原唱：</span>{{ props.song?.orginal_artist }}
      </p>
      <p><span>语言：</span>{{ props.song?.language }}</p>
      <p><span>切歌man的留言：</span>{{ props.song?.note }}</p>
      <p>
        <span>对应录播：</span>
        <a
          v-bind:href="
            'https://www.bilibili.com/video/' +
            props.song?.record.bv +
            '?p=' +
            props.song?.record.p +
            '&start_progress=' +
            props.song?.record_start_ms
          "
          target="_blank"
          rel="noreferrer noopener"
        >
          {{ props.song?.date }} p{{ props.song?.record.p }}
        </a>
        <span>时间点：</span>{{ props.song?.record.timecode }}
      </p>
      <p v-if="props.song?.ref !== false">
        <span>参考的路灯man：</span>
        <a
          v-bind:href="'https://space.bilibili.com/' + props.song?.ref.uid"
          target="_blank"
          rel="noreferrer noopener"
        >
          @{{ props.song?.ref.name }}
        </a>
      </p>
      <p v-if="props.song?.ref_cut !== false">
        感谢
        <a
          v-bind:href="'https://space.bilibili.com/' + props.song?.ref_cut.uid"
          target="_blank"
          rel="noreferrer noopener"
        >
          @{{ props.song?.ref_cut.name }}
        </a>
        提供的音频！
      </p>
    </div>
  </MainPopUp>
</template>

<style scoped>
@import "styles/details.scss";
</style>
