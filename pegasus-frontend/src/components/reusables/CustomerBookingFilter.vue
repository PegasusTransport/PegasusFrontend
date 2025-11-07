<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import type { BookingFilterRequestForAdminDto, BookingSearchRequestDto } from "@/types/booking";
import Button from "./Button.vue";

interface Props {
  isOpen: boolean;
  searchQuery: BookingSearchRequestDto;
  fromDate: string;
  toDate: string;
  sortBy: string;
}

interface Emits {
  (e: "close"): void;
  (e: "update:fromDate", value: string): void;
  (e: "update:toDate", value: string): void;
  (e: "update:searchQuery", value: BookingSearchRequestDto): void;
  (e: "update:sortBy", value: string): void;
  (e: "applyFilters"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();


const localFromDate = ref(props.fromDate);
const localToDate = ref(props.toDate);
const localSearchQuery = ref({ ...props.searchQuery });
const localSortBy = ref<string>(props.sortBy);

watch(
  () => props.fromDate,
  (newVal) => {
    localFromDate.value = newVal;
  }
);

watch(
  () => props.toDate,
  (newVal) => {
    localToDate.value = newVal;
  }
);

watch(
  () => props.searchQuery,
  (newVal) => {
    localSearchQuery.value = { ...newVal };
  },
  { deep: true }
);
watch(
  () => props.sortBy,
  (newVal) => {
    localSortBy.value = newVal;
  }
);

const updateFromDate = () => {
  emit("update:fromDate", localFromDate.value);
};

const updateToDate = () => {
  emit("update:toDate", localToDate.value);
};

const updateUpcomingOnly = () => {
  emit("update:searchQuery", { ...localSearchQuery.value });
};
const updateSortBy = () => {
  emit("update:sortBy", localSortBy.value);
};

const applyFilters = () => {
  emit("applyFilters");
  emit("close");
};

const resetFilters = () => {
  localFromDate.value = "";
  localToDate.value = "";
  localSearchQuery.value.upcomingOnly = false;
  localSortBy.value = "pickUpDateTime";
  emit("update:fromDate", "");
  emit("update:toDate", "");
  emit("update:searchQuery", { ...localSearchQuery.value });
  emit("update:sortBy", localSortBy.value)
  emit("applyFilters");
};
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-10" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div
                  class="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl"
                >
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle
                        class="text-base font-semibold text-gray-900"
                      >
                        Filter Bookings
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          @click="$emit('close')"
                        >
                          <span class="absolute -inset-2.5"></span>
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="size-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <div class="space-y-4">
                      <div>
                        <label
                          for="location"
                          class="block text-sm/6 font-medium text-gray-900"
                          >Sort By</label
                        >
                        <div class="mt-2 grid grid-cols-1">
                          <select
                            id="sort-by"
                            name="localSortBy"
                            v-model="localSortBy"
                            @change="updateSortBy"
                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                          >
                            <option value="pickUpDateTime">Pick Up Date</option>
                            <option value="price">Price</option>
                            <option value="pickUpAddress">
                              Pick Up Address
                            </option>
                            <option value="dropOffAddress">
                              Drop Off Address
                            </option>
                          </select>
                          <ChevronDownIcon
                            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2 "
                        >
                          From Date
                        </label>
                        <input
                          type="date"
                          v-model="localFromDate"
                          @change="updateFromDate"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-2"
                        >
                          To Date
                        </label>
                        <input
                          type="date"
                          v-model="localToDate"
                          @change="updateToDate"
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <div class="flex items-center">
                        <input
                          id="upcoming-only"
                          type="checkbox"
                          v-model="localSearchQuery.upcomingOnly"
                          @change="updateUpcomingOnly"
                          class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                          for="upcoming-only"
                          class="ml-2 block text-sm text-gray-900"
                        >
                          Show upcoming bookings only
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div
                    class="flex justify-between px-4 sm:px-6 pt-4 border-t border-gray-200"
                  >
                    <button
                      type="button"
                      @click="resetFilters"
                      class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Reset Filters
                    </button>
                    <Button
                      type="button"
                      @click="applyFilters"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
