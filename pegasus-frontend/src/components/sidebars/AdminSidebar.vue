<script setup lang="ts">
import {
  CalendarIcon,
  HomeIcon,
  UserIcon,
  MapIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { RouterLink } from "vue-router";

import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

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
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>
<template>
  <!-- Mobile menu button -->
  <div class="lg:hidden fixed top-4 left-4 z-50">
    <button
      @click="toggleSidebar"
      class="rounded-md bg-pg-primary p-2 text-white shadow-lg hover:bg-pg-primary/90 transition-colors"
    >
      <Bars3Icon class="h-6 w-6" aria-hidden="true" />
    </button>
  </div>

  <!-- Mobile sidebar -->
  <TransitionRoot as="template" :show="isSidebarOpen">
    <Dialog as="div" class="relative z-50 lg:hidden" @close="closeSidebar">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div
                class="absolute left-full top-0 flex w-16 justify-center pt-5"
              >
                <button
                  type="button"
                  class="-m-2.5 p-2.5"
                  @click="closeSidebar"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>

            <!-- Mobile Sidebar Content -->
            <div
              class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-pg-primary px-6 py-0.5 h-full border-r-2 border-r-white"
            >
              <RouterLink
                :to="{ name: 'overview' }"
                class="relative flex h-16 shrink-0 items-center"
                active-class=""
                exact-active-class=""
                @click="closeSidebar"
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
                          @click="closeSidebar"
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
                      href="https://www.flypgs.com/en"
                      target="_blank"
                      class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
                      @click="closeSidebar"
                    >
                      <span aria-hidden="true"
                        >Ta mig tillbaka till hemsidan</span
                      >
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Desktop sidebar (always visible on lg+) -->
  <div class="hidden lg:flex lg:w-64 lg:flex-col">
    <div
      class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-pg-primary px-6 py-0.5 h-full border-r-2 border-r-white"
    >
      <RouterLink
        :to="{ name: 'customerOverview' }"
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
              href="https://www.flypgs.com/en"
              target="_blank"
              class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
            >
              <span aria-hidden="true">Ta mig tillbaka till hemsidan</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
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
