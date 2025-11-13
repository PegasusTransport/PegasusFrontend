<script setup lang="ts">
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();
</script>

<template>
  <main>
    <router-view />
  </main>
</template>

<style scoped></style>
