<script setup lang="ts">
import Button from "./components/reusables/Button.vue";
import { useAuthStore } from "./stores/authStore";

const store = useAuthStore();
</script>

<template>
  <Button @click="store.logout">Log out</Button>
  <main>
    <router-view />
  </main>
</template>

<style scoped></style>
