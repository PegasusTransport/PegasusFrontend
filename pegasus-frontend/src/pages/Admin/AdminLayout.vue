<script setup lang="ts">
import AdminSidebar from "@/components/sidebars/AdminSidebar.vue";
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="lg:flex lg:h-screen">
      <AdminSidebar />
    </div>

    <div class="flex-1 overflow-auto bg-pg-secondary">
      <router-view />
    </div>
  </div>
</template>
