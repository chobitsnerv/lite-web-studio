<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainPopUp",
});
</script>

<script setup>
const props = defineProps({
  title: String,
});

const emit = defineEmits(["closepopup"]);
</script>

<template>
  <div class="background" v-on:mousedown.self="$emit('closepopup')">
    <div class="card c-popup">
      <div class="popup-title">
        <div>{{ props.title }}</div>
        <div class="popup-close" v-on:click.stop="$emit('closepopup')">
          <div class="popup-close-img"></div>
        </div>
      </div>
      <hr />
      <div class="popup-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "styles/main.scss";
</style>
