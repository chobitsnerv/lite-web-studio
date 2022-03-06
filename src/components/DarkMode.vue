<script>
import {
  computed,
  defineComponent,
  onMounted,
  watch,
  ref,
  onBeforeUnmount,
} from "vue";
export default defineComponent({
  name: "DarkMode",
});
</script>

<script setup>
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
} from "darkreader";

const props = defineProps({
  dark: { type: Boolean, default: false },
  watchSystem: { type: Boolean, default: false },
  brightness: { type: Number, default: 100 },
  contrast: { type: Number, default: 90 },
  sepia: { type: Number, default: 10 },
});

const systemDark = ref(false);
const mq = ref(null);

const appearanceSettings = computed(() => {
  return (
    String(props.brightness).padStart(3, 0) +
    String(props.contrast).padStart(3, 0) +
    String(props.sepia).padStart(3, 0)
  );
});

watch(
  () => props.dark,
  (newV) => {
    toggleDarkMode();
  }
);

watch(
  () => props.watchSystem,
  (newV) => {
    toggleDarkMode();
  }
);

watch(systemDark, (newV) => {
  toggleDarkMode();
});

const updateSystemTheme = (update) => {
  systemDark.value = update.matches;
};

const toggleDarkMode = () => {
  if (window) {
    if (props.dark || (!props.dark && props.watchSystem && systemDark.value)) {
      enableDarkMode({
        brightness: props.brightness,
        contrast: props.contrast,
        sepia: props.sepia,
      });
    } else disableDarkMode();
  }
};

onMounted(() => {
  if (mq.value === null && window) {
    mq.value = window.matchMedia("(prefers-color-scheme: dark)");
    mq.value.addEventListener("change", updateSystemTheme);
  }
  toggleDarkMode();
});

onBeforeUnmount(() => {
  if (mq.value !== null) {
    mq.value.removeEventListener("change", updateSystemTheme);
  }
});
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>
