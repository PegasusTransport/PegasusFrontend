<script setup lang="ts">
import Button from "./components/reusables/Button.vue";
import { useAuthStore } from "./stores/authStore";
const authStore = useAuthStore();
</script>

<template>
  <Button @click="authStore.logout">Log out</Button>
  <main>
    <router-view v-slot="{ Component }">
      <transition
        mode="out-in"
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style scoped></style>
