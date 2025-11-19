<script setup lang="ts">
import {
  CalendarIcon,
 
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  BanknotesIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";
import { RouterLink } from "vue-router";
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useAuthStore } from "@/stores/authStore";

const navigation = ref([
  {
    name: "Bookings",
    to: { name: "bookings" },
    icon: CalendarIcon,
  },
  { name: "Settings", to: { name: "settings" }, icon: Cog6ToothIcon },
  {
    name: "Drivers",
    to: { name: "drivers" },
    icon: UserGroupIcon,
  },
]);

// Additional mobile actions for the menu
const mobileActions = ref([
  {
    name: "Menu",
    action: "menu",
    icon: Bars3Icon,
  },
]);

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const handleMobileAction = (action: string) => {
  switch (action) {
    case 'menu':
      toggleSidebar();
      break;
  }
};

const authStore = useAuthStore();
</script>

<template>
  <!-- Mobile bottom navigation -->
  <div class="lg:hidden">
    <!-- Bottom tab bar -->
    <div class="fixed bottom-0 left-0 right-0 z-40 bg-pg-primary border-t border-white/10">
      <div class="grid grid-cols-4 h-16">
        <!-- Main navigation items -->
        <RouterLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.to"
          class="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <component :is="item.icon" class="h-6 w-6" aria-hidden="true" />
          <span class="text-xs mt-1">{{ item.name }}</span>
        </RouterLink>
        
        <!-- Menu button -->
        <button
          v-for="action in mobileActions"
          :key="action.name"
          @click="handleMobileAction(action.action)"
          class="flex flex-col items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          <component :is="action.icon" class="h-6 w-6" aria-hidden="true" />
          <span class="text-xs mt-1">{{ action.name }}</span>
        </button>
      </div>
    </div>

    <div class="pb-16"></div>
  </div>

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

            <!-- Mobile Menu Content -->
            <div
              class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-pg-primary px-6 py-6 h-full border-r-2 border-r-white"
            >
              <!-- Header -->
              <div class="flex h-16 shrink-0 items-center">
                <img
                  class="h-12 w-auto"
                  src="/src/assets/img/Pegasus.webp"
                  alt="Pegasus Transport"
                />
                <h2 class="ml-2 text-white font-bold text-lg">Admin Menu</h2>
              </div>

              <!-- Additional menu items -->
              <nav class="space-y-2">
                <button
                  @click="authStore.logout(); closeSidebar()"
                  class="flex items-center gap-x-3 rounded-md p-3 w-full text-left text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <ArrowRightOnRectangleIcon class="h-6 w-6" />
                  <span>Log out</span>
                </button>
                
                <a
                  href="https://pegasustransport.se/"
                  target="_blank"
                  class="flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  @click="closeSidebar"
                >
                  <GlobeAltIcon class="h-6 w-6" />
                  <span>Home page</span>
                </a>
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
        :to="{ name: 'bookings' }"
        class="relative flex h-16 shrink-0 items-center"
        active-class=""
        exact-active-class=""
      >
        <div class="mt-2">
          <img
            class="h-16 w-auto"
            src="/src/assets/img/Pegasus.webp"
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
        </ul>
        <div class="flex flex-col items-bottom">
          <li class="-mx-6 mt-auto">
            <a
              @click="authStore.logout"
              class="flex cursor-pointer items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5 w-full"
            >
              <span aria-hidden="true">Log out</span>
            </a>
          </li>
          <li class="-mx-6 mt-auto flex">
            <a
              href="https://pegasustransport.se/"
              target="_blank"
              class="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5 w-full"
            >
              <span aria-hidden="true">Home page</span>
            </a>
          </li>
        </div>
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

.lg\:hidden .router-link-exact-active {
  background-color: color-mix(
    in oklab,
    var(--color-white) /* #fff = #ffffff */ 10%,
    transparent
  );
  color: white;
  border-radius: 0.375rem;
}
</style>