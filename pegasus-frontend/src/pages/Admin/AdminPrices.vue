<script setup lang="ts">
import CreateAdmin from "@/components/admin/CreateAdmin.vue";
import TaxiPrices from "@/components/admin/TaxiPrices.vue";
import ProfileSettings from "@/components/customer/ProfileSettings.vue";
import ChangePassword from "@/components/reusables/ChangePassword.vue";
</script>

<template>
  <div class="p-3 flex flex-col gap-5">
    <TaxiPrices />
    <CreateAdmin />
    <ProfileSettings />
   
  </div>
</template>
