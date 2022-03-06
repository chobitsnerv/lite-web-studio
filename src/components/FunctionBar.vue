<script>
import { computed, defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "FunctionBar",
});
</script>

<script setup>
import utils from "utils/utils";
import bus from "vue3-eventbus";

const timeOptions = ref([
  { text: "15minutes", value: 15 },
  { text: "30minutes", value: 30 },
  { text: "60minutes", value: 60 },
  { text: "120minutes", value: 120 },
  { text: "custom", value: "custom" },
]);
const timeOption = ref(15);
const timeInputValue = ref("");
const isCountingDown = ref(false);
const countdownTime = ref(0);
const intervalObj = ref(null);
const nightMode = ref("light");

const nightModeText = computed(() => {
  if (nightMode.value === "light") return "白天";
  if (nightMode.value === "dark") return "黑夜";
  return "系统";
});

const toggleStart = () => {
  if (isCountingDown.value) {
    // 停止计时
    clearInterval(intervalObj.value);
  } else {
    // 开始计时
    if (timeOption.value === "custom")
      countdownTime.value = parseInt(timeInputValue.value) * 60;
    else countdownTime.value = timeOption.value * 60;
    intervalObj.value = setInterval(() => {
      countdownTime.value -= 1;
      if (countdownTime.value <= 0) {
        clearInterval(intervalObj.value);
        isCountingDown.value = false;
        bus.emit("player-audio-pause");
        //this.$parent.$refs.player.audio_pause();
      }
    }, 1000);
  }
  isCountingDown.value = !isCountingDown.value;
};

const countdownDisplay = computed(() => {
  let _sec = (countdownTime.value % 60).toString();
  let _min = Math.floor(countdownTime.value / 60).toString();
  if (_sec.length === 1) _sec = "0" + _sec;
  if (_min.length === 1) _min = "0" + _min;
  return _min + ":" + _sec;
});

const switchNightMode = () => {
  if (nightMode.value === "light") nightMode.value = "dark";
  else if (nightMode.value === "dark") nightMode.value = "system";
  else if (nightMode.value === "system") nightMode.value = "light";
  utils.saveSettings({ night_mode: nightMode.value });
  bus.emit("night-mode-change", nightMode.value);
};

onMounted(() => {
  //todo remove after 1month for fixing issue on darkmode icon display
  if (typeof utils.readSettings().night_mode === String)
    nightMode.value = utils.readSettings().night_mode;
});
</script>

<template>
  <div class="c-countdown-outer">
    <div
      class="night-mode-button"
      v-on:click="switchNightMode"
      v-bind:title="nightModeText"
    >
      <div class="lightIcon" v-show="nightMode == 'light'" />
      <div class="darkIcon" v-show="nightMode == 'dark'" />
      <div class="systemIcon" v-show="nightMode == 'system'" />
    </div>
    <div class="c-countdown">
      <div class="countdown-text"><div>{{ $t('countDownTime') }}</div></div>
      <div class="general-input countdown-timer" v-show="isCountingDown">
        {{ countdownDisplay }}
      </div>
      <select
        class="general-input countdown-select"
        v-model="timeOption"
        v-show="!isCountingDown"
      >
        <option
          v-for="option in timeOptions"
          v-bind:key="option.text"
          v-bind:value="option.value"
        >
          {{ $t(option.text) }}
        </option>
      </select>
      <input
        class="general-input countdown-input"
        v-show="timeOption === 'custom' && !isCountingDown"
        v-model="timeInputValue"
        type="number"
        min="0"
        placeholder="$t('countDownTime')"
      />
      <button class="general-button countdown-button" v-on:click="toggleStart">
        {{ isCountingDown ? $t('empty'): $t('start') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@import "@/styles/functionbar.scss";
</style>
