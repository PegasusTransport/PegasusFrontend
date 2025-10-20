<script setup lang="ts">
import {
  CalendarIcon,
  HomeIcon,
  UserIcon,
  MapIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";
import { RouterLink } from "vue-router";

import { ref } from "vue";

const navigation = ref([
  {
    name: "Översikt",
    to: { name: "overview" },
    icon: HomeIcon,
  },
  { name: "Resor", to: { name: "trips" }, icon: MapIcon },
  {
    name: "Förare",
    to: { name: "drivers" },
    icon: UserGroupIcon,
  },
  {
    name: "Bokningar",
    to: { name: "bookings" },
    icon: CalendarIcon,
  },
]);
</script>
<template>
  <div
    class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-pg-primary px-6 py-0.5 h-full border-r-2 border-r-white"
  >
    <RouterLink
      :to="{ name: 'overview' }"
      class="relative flex h-16 shrink-0 items-center"
      active-class=""
      exact-active-class=""
    >
      <div class="mt-2">
        <img
          class="h-16 w-auto"
          src="/src/assets/img/Pegasus.png"
          alt="Pegasus Transport"
        />
      </div>
      <div class="flex items-center ml-2 mt-2">
        <h1 class="text-white font-bold">Pegasus Transport</h1>
      </div>
    </RouterLink>
    <nav class="relative flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <RouterLink
                :to="item.to"
                class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
              >
                <component
                  :is="item.icon"
                  class="size-6 shrink-0"
                  aria-hidden="true"
                />
                {{ item.name }}
              </RouterLink>
            </li>
          </ul>
        </li>

        <li class="-mx-6 mt-auto">
          <a
            href="https://www.flypgs.com/en?gclsrc=aw.ds&ds_rl=1250899&ds_rl=1263089&gad_source=1&gad_campaignid=10152160513&gbraid=0AAAAADscbGzQYG92N-L5x7wfb_XaAGyYJ&gclid=CjwKCAjwr8LHBhBKEiwAy47uUlN9x4opdfAjnNkpsCbzTU9kUGMs0lSXFPVGJeEt6OItABAmmIbZzRoCxLoQAvD_BwE"
            target="_blank"
            class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
          >
            <span aria-hidden="true">Ta mig tillbaka till hemsidan</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.router-link-exact-active {
  background-color: color-mix(
    in oklab,
    var(--color-white) /* #fff = #ffffff */ 5%,
    transparent
  );
  color: white;
}
</style>
