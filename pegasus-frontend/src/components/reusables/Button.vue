<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    link?: boolean;
    to?: string;
    buttonClass?: string;
  }>(),
  { link: false, buttonClass: "" }
);

const setButtonClass = computed(
  () =>
    props.buttonClass ||
    "rounded-md cursor-pointer bg-pg-persian px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-300"
);
</script>

<template>
  <button v-if="!link" type="button" :class="setButtonClass">
    <slot></slot>
  </button>
  <RouterLink v-else :to="to!" :class="setButtonClass">
    <slot></slot>
  </RouterLink>
</template>
