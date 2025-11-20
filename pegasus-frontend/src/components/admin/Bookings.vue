<script setup lang="ts">
import { adminApi } from "@/endpoints/admin";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import { computed, onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import Button from "../reusables/Button.vue";
import BookingModal from "./BookingModal.vue";
import {
  BookingStatus,
  defaultBookingFilter,
  getBookingStatusString,
  SortOrder,
  type BookingFilterRequestForAdminDto,
} from "@/types/booking";
import { debounce } from "lodash-es";
import BookingFilter from "../reusables/BookingFilter.vue";
import BasePagination from "../reusables/BasePagination.vue";
import { FunnelIcon } from "@heroicons/vue/24/outline";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";

const toast = useToast();
const loading = ref(false);
const error = ref<string | null>(null);
const bookings = ref<BookingResponseDto[]>([]);
const openBookingModal = ref(false);
const selectedBookingId = ref<number | null>(null);
const sortBy = ref("pickUpDateTime");
const currentPage = ref(1);
const totalPages = ref(0);
const hasNextPage = ref(false);
const hasPreviousPage = ref(false);
const showFilterModal = ref(false);

const openBookingDetails = (bookingId: number) => {
  selectedBookingId.value = bookingId;
  openBookingModal.value = true;
};

const closeModal = () => {
  openBookingModal.value = false;
  selectedBookingId.value = null;
};
const onBookingUpdated = (updatedBooking: BookingResponseDto) => {
  const index = bookings.value.findIndex(
    (b) => b.bookingId === updatedBooking.bookingId
  );
  if (index !== -1) {
    bookings.value[index] = updatedBooking;
  }
};
const filterQuery = ref<BookingFilterRequestForAdminDto>({
  ...defaultBookingFilter,
});
const activeFiltersCount = computed(() => {
  let count = 0;
  if (filterQuery.value.search) count++;
  if (filterQuery.value.status !== undefined) count++;
  if (filterQuery.value.driverAssigned !== undefined) count++;
  if (filterQuery.value.toDate) count++;
  if (filterQuery.value.period !== undefined && filterQuery.value.period !== defaultBookingFilter.period) count++; // Changed this line
  if (filterQuery.value.pickupAddress) count++;
  if (filterQuery.value.dropoffAddress) count++;
  if (filterQuery.value.customerName) count++;
  if (filterQuery.value.flightNumber) count++;
  if (filterQuery.value.sortBy !== defaultBookingFilter.sortBy) count++;
  if (filterQuery.value.sortOrder !== defaultBookingFilter.sortOrder) count++;
  return count;
});

const fetchBookings = async () => {
  try {
    loading.value = true;
    error.value = null;
    filterQuery.value.page = currentPage.value;

    const response = await adminApi.getAllBookings(filterQuery.value);
    if (response) {
      bookings.value = response.data.items;
      currentPage.value = response.data.page;
      totalPages.value = response.data.totalPages;
      hasNextPage.value = response.data.hasNextPage;
      hasPreviousPage.value = response.data.hasPreviousPage;
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status: BookingStatus) => {
  const colors = {
    [BookingStatus.Completed]:
      "text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs",
    [BookingStatus.Cancelled]:
      "text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs",
    [BookingStatus.Confirmed]:
      "text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs",
    [BookingStatus.PendingEmailConfirmation]:
      "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs",
  };
  return (
    colors[status] || "text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs"
  );
};
const debouncedSearch = debounce(() => {
  filterQuery.value.page = 1;
  fetchBookings();
}, 300);

const openFilterModal = () => {
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
};

const applyFilters = () => {
  filterQuery.value.page = 1;
  currentPage.value = 1;
  fetchBookings();
};

const goToPage = (page: number) => {
  filterQuery.value.page = page;
  currentPage.value = page;

  fetchBookings();
};

const nextPage = () => {
  const next = currentPage.value + 1;
  currentPage.value = next;
  filterQuery.value.page = next;
  fetchBookings();
};

const previousPage = () => {
  const prev = Math.max(1, currentPage.value - 1);
  currentPage.value = prev;
  filterQuery.value.page = prev;
  fetchBookings();
};
watch(sortBy, (newSortBy) => {
  filterQuery.value.sortBy = newSortBy;
  filterQuery.value.page = 1;
  fetchBookings();
});
const splitAddress = (address: string): string => {
  const parts = address.split(/[,;]/);
  if (parts.length > 1) {
    return parts.join("\n");
  }
  return address;
};

onMounted(async () => {
  await fetchBookings();
});
</script>

<template>
  <div class="bg-white p-2  rounded-2xl flex flex-col gap-4">
    <!-- Search filters -->
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="p-3">
          <h1 class="text-3xl font-semibold text-gray-900">Bookings</h1>
          <div class="sm:flex-auto">
            <p class="mt-2 text-sm text-gray-700">
              A list of all your previous and current bookings.
            </p>
          </div>
          <div class="mt-4 flex gap-4 items-center">
            <input
              class="flex-1 max-w-md rounded-md shadow-sm focus:border-pg-persian p-2"
              v-model="filterQuery.search"
              placeholder="Search bookings..."
              @input="debouncedSearch"
            />
            <button
              @click="openFilterModal"
              class="relative cursor-pointer inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <FunnelIcon
                class="-ml-0.5 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <p class="hidden md:block">Filters</p>
              <span
                v-if="activeFiltersCount > 0"
                class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-pg-persian text-xs font-medium text-white flex items-center justify-center"
              >
                {{ activeFiltersCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Table -->
    <div v-if="loading"><TaxiSpinner size="large" /></div>
    <div v-else>
      <div
        class="px-3 py-8 text-center text-sm text-gray-500"
        v-if="bookings.length === 0"
      >
        <p>You don't have any bookings</p>
      </div>
      <div v-else class="px-4 sm:px-6 lg:px-8">
        <!-- Mobile Cards -->
        <div class="block md:hidden space-y-4">
          <div
            v-for="booking in bookings"
            :key="booking.bookingId"
            class="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="text-sm font-bold text-gray-900">
                {{
                  new Date(booking.pickUpDateTime).toLocaleString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                }}
              </div>
              <div class="text-sm text-gray-500">
                {{
                  new Intl.NumberFormat("sv-SE", {
                    style: "currency",
                    currency: "SEK",
                  }).format(booking.price)
                }}
                SEK
              </div>
            </div>
            <div class="space-y-1 text-sm text-gray-600 mb-3">
              <div>
                <span class="font-bold">From:</span>
                {{ booking.pickUpAddress }}
              </div>
              <div>
                <span class="font-bold">To:</span>
                {{ booking.dropOffAddress }}
              </div>
            </div>
            <Button
              size="sm"
              class="w-full"
              @click="openBookingDetails(booking.bookingId)"
              >See Details</Button
            >
          </div>
        </div>
        <!-- DESKTOP -->
        <div class="hidden sm:block mt-2">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-1"
            >
              <div
                class="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg"
              >
                <table class="relative min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-bold text-gray-900 sm:pl-6"
                      >
                        Pick Up Time
                      </th>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-bold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Pick Up Adress
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Drop off Adress
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Price
                      </th>
                       <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Status
                      </th>
                      <th scope="col" class="py-3.5 pr-4 pl-3 sm:pr-6">
                        <span class="sr-only"></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-if="bookings.length === 0">
                      <td
                        colspan="5"
                        class="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        You don't have any bookings
                      </td>
                    </tr>
                    <tr
                      v-else
                      v-for="booking in bookings"
                      :key="booking.bookingId"
                    >
                      <td
                        class="min-w-40 py-4 pr-3 pl-4 text-sm font-bold whitespace-nowrap text-gray-900 sm:pl-6"
                      >
                        {{
                          new Date(booking.pickUpDateTime).toLocaleString(
                            "sv-SE",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )
                        }}
                      </td>
                      <td
                        class="min-w-0 px-3 py-4 text-sm whitespace-pre-line text-gray-500"
                      >
                        <div class="leading-5">
                          {{ booking.firstName }} {{ booking.lastName }}
                        </div>
                      </td>
                      <td
                        class="min-w-0 px-3 py-4 text-sm whitespace-pre-line text-gray-500"
                      >
                        <div class="leading-5">
                          {{ splitAddress(booking.pickUpAddress) }}
                        </div>
                      </td>
                      <td
                        class="px-3 py-4 text-sm whitespace-pre-line text-gray-500"
                      >
                        <div class="leading-5">
                          {{ splitAddress(booking.dropOffAddress) }}
                        </div>
                      </td>
                      <td
                        class="px-3 py-4 text-sm whitespace-nowrap text-gray-900 font-bold"
                      >
                        {{
                          new Intl.NumberFormat("sv-SE", {
                            style: "currency",
                            currency: "SEK",
                          }).format(booking.price)
                        }}
                      </td>
                      <td>
                        <span :class="getStatusColor(booking.status)">{{
                          getBookingStatusString(booking.status)
                        }}</span>
                      </td>
                      <td
                        class="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                      >
                        <Button @click="openBookingDetails(booking.bookingId)"
                          >Details</Button
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BasePagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :has-next-page="hasNextPage"
      :has-previous-page="hasPreviousPage"
      @go-to-page="goToPage"
      @next-page="nextPage"
      @previous-page="previousPage"
    />
  </div>

  <BookingModal
    :open="openBookingModal"
    :booking-id="selectedBookingId"
    @close="closeModal"
    @updated="onBookingUpdated"
  />

  <BookingFilter
    :is-open="showFilterModal"
    :filter-query="filterQuery"
    @close="closeFilterModal"
    @update:filter-query="filterQuery = $event"
    @apply-filters="applyFilters"
  />
</template>
