<script setup lang="ts">
import Button from "./components/reusables/Button.vue";
import { useAuthStore } from "./stores/authStore";

const authStore = useAuthStore();
</script>

<template>
  <Button @click="authStore.logout">Log out</Button>
  <main>
    <router-view />
  </main>
</template>

<style scoped></style>
