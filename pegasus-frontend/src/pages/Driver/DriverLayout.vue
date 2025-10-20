<script setup lang="ts">
import DriverSidebar from "@/components/sidebars/DriverSidebar.vue";
</script>

<template>
 <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 flex-shrink-0">
      <DriverSidebar />
    </div>

    <div class="flex-1 overflow-auto bg-pg-secondary">
      <router-view />
    </div>
  </div>
</template>
