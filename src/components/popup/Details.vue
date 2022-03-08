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
  <MainPopUp v-on:closepopup="$emit('closepopup')" :title="$t('songDetail')">
    <div class="content">
      <p><span>{{ $t('songName')  }}：</span>{{ props.song?.name }}</p>
      <p><span>{{ $t('singer')  }}：</span>{{ props.song?.artist }}</p>
      <p><span>{{ $t('status')  }}：</span>{{ props.song?.status }}</p>
      <p v-if="props.song?.orginal_artist !== ''">
        <span>{{ $t('originalArtist')  }}：</span>{{ props.song?.orginal_artist }}
      </p>
      <p><span>{{ $t('language')  }}：</span>{{ props.song?.language }}</p>
      <p><span>{{ $t('notes')  }}</span>{{ props.song?.note }}</p>
      <p>
        <span>{{ $t('record')  }}：</span>
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
        <span>{{ $t('timestamp')  }}：</span>{{ props.song?.record.timecode }}
      </p>
      <p v-if="props.song?.ref !== false">
        <span>{{ $t('reference')  }}：</span>
        <a
          v-bind:href="'https://space.bilibili.com/' + props.song?.ref.uid"
          target="_blank"
          rel="noreferrer noopener"
        >
          @{{ props.song?.ref.name }}
        </a>
      </p>
      <p v-if="props.song?.ref_cut !== false">
        {{ $t('thanks1')  }}
        <a
          v-bind:href="'https://space.bilibili.com/' + props.song?.ref_cut.uid"
          target="_blank"
          rel="noreferrer noopener"
        >
          @{{ props.song?.ref_cut.name }}
        </a>
        {{ $t('thanks2')  }}
      </p>
    </div>
  </MainPopUp>
</template>

<style scoped>
@import "@/styles/details.scss";
</style>
