<script>
import { computed, defineComponent, ref, watch, nextTick } from "vue";
export default defineComponent({
  name: "SongListPagination",
});
</script>

<script setup>
const props = defineProps({
  total: Number,
  page: Number,
  perPage: Number,
});

const emit = defineEmits(["update:page", "update:perPage"]);

const nPage = ref(props.page);
const nPerPage = ref(props.perPage);
const perPageOption = ref([
  { text: "10", value: 10 },
  { text: "20", value: 20 },
  { text: "50", value: 50 },
  { text: "100", value: 100 },
  { text: "全部", value: 999999 },
]);
const inputPage = ref(1);
const currentPage = ref(null);

const totalPage = computed(() => {
  return Math.ceil(props.total / nPerPage.value);
});

const focusInput = (e) => {
  currentPage.value = inputPage.value;
  nextTick(() => {
    e.currentTarget.setSelectionRange(0, currentPage.value.toString().length);
  });
};

const checkPage = () => {
  const _p = parseInt(currentPage.value);
  if (_p >= 1 && _p <= Math.ceil(props.total / nPerPage.value)) changePage(_p);
  else inputPage.value = nPage.value;
  currentPage.value = null;
};

const addPage = (p) => {
  const _toPage = nPage.value + p;
  if (_toPage >= 1 && _toPage <= Math.ceil(props.total / nPerPage.value))
    changePage(_toPage);
};

const toLastPage = () => {
  changePage(Math.ceil(props.total / nPerPage.value));
};

const changePage = (p) => {
  inputPage.value = p;
  nPage.value = p;
  emit("update:page", p);
};

const changePerPage = () => {
  // 换每页数量的时候回到第一页
  changePage(1);
  emit("update:perPage", nPerPage.value);
};

watch(
  () => props.page,
  (current, previous) => {
    inputPage.value = current;
    nPage.value = current;
  }
);
</script>

<template>
  <div class="c-pagination">
    <div class="pagination-item pagination-total">
      {{ (nPage - 1) * nPerPage + 1 }}-{{
        Math.min(nPage * nPerPage, total)
      }}
      共{{ total }}首
    </div>
    <div class="pagination-item pagination-per-page-label">每页数量:</div>
    <select
      class="pagination-item pagination-per-page-select"
      v-model="nPerPage"
      v-on:change="changePerPage"
    >
      <option
        v-for="option in perPageOption"
        v-bind:value="option.value"
        v-bind:key="option.text"
      >
        {{ option.text }}
      </option>
    </select>
    <div class="pagination-item c-pagination-go">
      <div
        class="pagination-go-first pagination-go-button"
        v-on:click="changePage(1)"
      >
        <div></div>
      </div>
      <div
        class="pagination-go-left pagination-go-button"
        v-on:click="addPage(-1)"
      >
        <div></div>
      </div>
      <input
        class="pagination-current-page"
        v-model="currentPage"
        :placeholder="[[inputPage]] + '/' + [[totalPage]]"
        v-on:focus="focusInput($event)"
        v-on:blur="checkPage"
        v-on:keydown.enter="$event.target.blur()"
      />
      <div
        class="pagination-go-right pagination-go-button"
        v-on:click="addPage(1)"
      >
        <div></div>
      </div>
      <div
        class="pagination-go-last pagination-go-button"
        v-on:click="toLastPage"
      >
        <div></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "styles/songlistpagination.scss";
</style>
