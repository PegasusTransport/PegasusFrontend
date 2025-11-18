<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import {
  BookingPeriodHelper,
  BookingStatus,
  defaultBookingFilter,
  getBookingStatusString,
  SortOrder,
  type BookingFilterRequestForAdminDto,
} from "@/types/booking";
import Button from "./Button.vue";

interface Props {
  isOpen: boolean;
  filterQuery: BookingFilterRequestForAdminDto;
}

interface Emits {
  (e: "close"): void;
  (e: "update:filterQuery", value: BookingFilterRequestForAdminDto): void;
  (e: "applyFilters"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localFilter = ref<BookingFilterRequestForAdminDto>({
  ...props.filterQuery,
});

watch(
  () => props.filterQuery,
  (newVal) => {
    localFilter.value = newVal;
  },
  { deep: true }
);

const statusOptions = [
  { value: undefined, label: "All Statuses" },
  {
    value: BookingStatus.PendingEmailConfirmation,
    label: getBookingStatusString(BookingStatus.PendingEmailConfirmation),
  },
  {
    value: BookingStatus.Confirmed,
    label: getBookingStatusString(BookingStatus.Confirmed),
  },
  {
    value: BookingStatus.Cancelled,
    label: getBookingStatusString(BookingStatus.Cancelled),
  },
  {
    value: BookingStatus.Completed,
    label: getBookingStatusString(BookingStatus.Completed),
  },
];

const periodOptions = [
   { value: BookingPeriodHelper.Current, label: "Current & Future" },
  { value: undefined, label: "All" },
  { value: BookingPeriodHelper.Past, label: "Past" },
  { value: BookingPeriodHelper.Current, label: "Current" },
  { value: BookingPeriodHelper.Future, label: "Future" },
  { value: BookingPeriodHelper.Today, label: "Today" },
  { value: BookingPeriodHelper.ThisWeek, label: "This Week" },
  { value: BookingPeriodHelper.ThisMonth, label: "This Month" },
];
const sortOptions = [
  { value: "pickUpDateTime", label: "Pick Up Date" },
  { value: "price", label: "Price" },
  { value: "pickUpAddress", label: "Pick Up Address" },
  { value: "dropOffAddress", label: "Drop Off Address" },
  { value: "customerName", label: "Customer Name" },
  { value: "status", label: "Status" },
];

const updateFilter = () => {
  emit("update:filterQuery", { ...localFilter.value });
};

const applyFilters = () => {
  emit("applyFilters");
  emit("close");
};
const resetFilters = () => {
  localFilter.value = { ...defaultBookingFilter };
  emit("update:filterQuery", { ...localFilter.value });
  emit("applyFilters");
};

const handlePeriodChange = () => {
  if (localFilter.value.period === undefined) {
    localFilter.value.sortOrder = SortOrder.Desc;
  } else {
    localFilter.value.sortOrder = SortOrder.Asc;
  }
  updateFilter();
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
                      

                      <!-- Status Filter -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <div class="mt-2 grid grid-cols-1">
                          <select
                            v-model="localFilter.status"
                            @change="updateFilter"
                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                          >
                            <option
                              v-for="option in statusOptions"
                              :key="option.label"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </option>
                          </select>
                          <ChevronDownIcon
                            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <!-- Time Period -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Time Period
                        </label>
                        <div class="mt-2 grid grid-cols-1">
                          <select
                            v-model="localFilter.period"
                            @change="handlePeriodChange"
                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                          >
                            <option
                              v-for="option in periodOptions"
                              :key="option.label"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </option>
                          </select>
                          <ChevronDownIcon
                            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                     

                      <!-- Driver Assignment -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Driver Assignment
                        </label>
                        <div class="mt-2 grid grid-cols-1">
                          <select
                            v-model="localFilter.driverAssigned"
                            @change="updateFilter"
                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                          >
                            <option :value="undefined">All Bookings</option>
                            <option :value="true">Driver Assigned</option>
                            <option :value="false">No Driver Assigned</option>
                          </select>
                          <ChevronDownIcon
                            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <!-- Location Filters -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Pickup Address
                        </label>
                        <input
                          type="text"
                          v-model="localFilter.pickupAddress"
                          @input="updateFilter"
                          placeholder="Filter by pickup location..."
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Drop-off Address
                        </label>
                        <input
                          type="text"
                          v-model="localFilter.dropoffAddress"
                          @input="updateFilter"
                          placeholder="Filter by drop-off location..."
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <!-- Customer & Driver Filters -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          v-model="localFilter.customerName"
                          @input="updateFilter"
                          placeholder="Filter by customer name..."
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Flight Number
                        </label>
                        <input
                          type="text"
                          v-model="localFilter.flightNumber"
                          @input="updateFilter"
                          placeholder="Filter by flight number..."
                          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        />
                      </div>

                      <!-- Sort Options -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Sort By
                        </label>
                        <div class="mt-2 grid grid-cols-1">
                          <select
                            v-model="localFilter.sortBy"
                            @change="updateFilter"
                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                          >
                            <option
                              v-for="option in sortOptions"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </option>
                          </select>
                          <ChevronDownIcon
                            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <!-- Sort Order -->
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Sort Order
                        </label>
                        <div class="mt-2 grid grid-cols-1">
                          <select
                            v-model="localFilter.sortOrder"
                            @change="updateFilter"
                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                          >
                            <option :value="SortOrder.Desc">Descending</option>
                            <option :value="SortOrder.Asc">Ascending</option>
                          </select>
                          <ChevronDownIcon
                            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            aria-hidden="true"
                          />
                        </div>
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
