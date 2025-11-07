<script setup lang="ts">
import CustomerSidebar from '@/components/sidebars/CustomerSidebar.vue';

</script>

<template>
    <div class="flex h-screen">
    <!-- Sidebar -->
  <div class="lg:flex lg:h-screen">
      <CustomerSidebar />
    </div>

    <div class="flex-1 overflow-auto bg-pg-secondary">
      <router-view />
    </div>
  </div>
</template>