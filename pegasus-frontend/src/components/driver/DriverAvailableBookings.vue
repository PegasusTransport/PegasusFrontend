<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import {
  type BookingSearchRequestDto,
  BookingStatus,
  SortOrder,
} from "@/types/booking";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import { debounce } from "lodash-es";
import Button from "../reusables/Button.vue";
import { driverApi } from "@/endpoints/driver";
import GoogleMap from "./GoogleMap.vue";
import Modal from "../reusables/Modal.vue";
import BasePagination from "../reusables/BasePagination.vue";
import { FunnelIcon } from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import BookingFilter from "../reusables/BookingFilter.vue";
import CustomerBookingFilter from "../reusables/CustomerBookingFilter.vue";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";

const bookings = ref<BookingResponseDto[]>([]);
const sortBy = ref("pickUpDateTime");
const currentPage = ref(1);
const totalPages = ref(0);
const hasNextPage = ref(false);
const hasPreviousPage = ref(false);
const isLoading = ref(false);
const showFilterModal = ref(false);
const fromDate = ref("");
const toDate = ref("");
const openMapModal = ref(false);
const selectedBookingId = ref<number | null>(null);
const toast = useToast();

const searchQuery = ref<BookingSearchRequestDto>({
  page: 1,
  pageSize: 4,
  sortBy: "pickUpDateTime",
  sortOrder: SortOrder.Asc,
  upcomingOnly: false,
});

const selectedBooking = computed(() => {
  return (
    bookings.value.find((b) => b.bookingId === selectedBookingId.value) || null
  );
});

const fetchBookings = async () => {
  try {
    isLoading.value = true;
    const response = await driverApi.getAvailableDriverBookings(
      searchQuery.value
    );

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
    isLoading.value = false;
  }
};
const acceptBooking = async (bookingId: number) => {
  try {
    isLoading.value = true;
    await driverApi.acceptJob(bookingId);

    toast.success("The booking was assigned to you!");
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to accept booking";

    toast.error(errorMessage);
  } finally {
    isLoading.value = false;
    fetchBookings();
  }
};
const debouncedSearch = debounce(() => {
  searchQuery.value.page = 1;
  fetchBookings();
}, 300);

const updateDateFilter = () => {
  searchQuery.value.fromDate = fromDate.value || undefined;
  searchQuery.value.toDate = toDate.value || undefined;
  searchQuery.value.page = 1;
  fetchBookings();
};

const openFilterModal = () => {
  showFilterModal.value = true;
};

const closeFilterModal = () => {
  showFilterModal.value = false;
};
const activeFiltersCount = computed(() => {
  let count = 0;
  if (fromDate.value) count++;
  if (toDate.value) count++;
  if (searchQuery.value.upcomingOnly) count++;
  if (sortBy.value !== "pickUpDateTime") count++;
  return count;
});

const goToPage = (page: number) => {
  searchQuery.value.page = page;
  currentPage.value = page;
  fetchBookings();
};

const nextPage = () => {
  const next = currentPage.value + 1;
  currentPage.value = next;
  searchQuery.value.page = next;
  fetchBookings();
};

const previousPage = () => {
  const prev = Math.max(1, currentPage.value - 1);
  currentPage.value = prev;
  searchQuery.value.page = prev;
  fetchBookings();
};
watch(sortBy, (newSortBy) => {
  searchQuery.value.sortBy = newSortBy;
  searchQuery.value.page = 1;
  fetchBookings();
});

const splitAddress = (address: string): string => {
  const parts = address.split(/[,;]/);
  if (parts.length > 1) {
    return parts.join("\n");
  }

  // If no comma/semicolon, try to split at a reasonable length
  if (address.length > 30) {
    const words = address.split(" ");
    const mid = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, mid).join(" ");
    const secondLine = words.slice(mid).join(" ");
    return `${firstLine}\n${secondLine}`;
  }

  return address;
};
onMounted(() => {
  fetchBookings();
});
</script>

<template>
  <div class="bg-white p-4 m-4 rounded-2xl flex flex-col gap-4">
    <!-- Search filters -->
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="p-3">
          <h1 class="text-3xl font-semibold text-gray-900">
            Available Bookings
          </h1>
          <div class="sm:flex-auto">
            <p class="mt-2 text-sm text-gray-700">
              A list of all available bookings to take.
            </p>
          </div>
          <div class="mt-4 flex gap-4 items-center flex-row">
            <input
              class="flex-1 max-w-md rounded-md shadow-sm p-2 focus:border-pg-persian"
              v-model="searchQuery.search"
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
    <div v-if="isLoading"><TaxiSpinner size="large" /></div>
    <div v-else>
      <div
        class="px-3 py-8 text-center text-sm text-gray-500"
        v-if="bookings.length === 0"
      >
        <p>There are not any available bookings right now</p>
      </div>
      <div v-else class="px-4 sm:px-6 lg:px-8">
        <!-- Mobile Cards (hidden on larger screens) -->
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
              <div class="text-sm font-bold text-gray-500">
                {{
                  new Intl.NumberFormat("sv-SE", {
                    style: "currency",
                    currency: "SEK",
                  }).format(booking.price)
                }}
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
            <div class="flex justify-between">
              <Button
                @click="
                  () => {
                    selectedBookingId = booking.bookingId;
                    openMapModal = true;
                  }
                "
                >Trajectory</Button
              >
              <Button @click="acceptBooking(booking.bookingId)">Accept</Button>
            </div>
          </div>
        </div>
        <div class="hidden md:block mt-2">
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
                      <th scope="col" class="py-3.5 pr-4 pl-3 sm:pr-6">
                        <span class="sr-only"></span>
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
                      <td
                        class="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                      >
                        <Button
                          @click="
                            () => {
                              selectedBookingId = booking.bookingId;
                              openMapModal = true;
                            }
                          "
                          >Trajectory</Button
                        >
                      </td>
                      <td
                        class="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                      >
                        <Button @click="acceptBooking(booking.bookingId)"
                          >Accept</Button
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

  <Modal xl :open="openMapModal" @close="openMapModal = false">
    <h3 class="mb-5 font-bold text-2xl">Trajectory Plan</h3>
    <p><strong>Pickup Address:</strong> {{ selectedBooking?.pickUpAddress }}</p>
    <p v-if="selectedBooking?.firstStopAddress">
      <strong>First stop:</strong> {{ selectedBooking?.firstStopAddress }}
    </p>
    <p v-if="selectedBooking?.secondStopAddress">
      <strong>Second stop:</strong> {{ selectedBooking?.secondStopAddress }}
    </p>
    <p>
      <strong>Drop off Address:</strong> {{ selectedBooking?.dropOffAddress }}
    </p>
    <GoogleMap class="mt-4 h-96" :booking="selectedBooking!" />
  </Modal>
  <CustomerBookingFilter
    :is-open="showFilterModal"
    :search-query="searchQuery"
    :from-date="fromDate"
    :to-date="toDate"
    :sort-by="sortBy"
    @close="closeFilterModal"
    @update:from-date="fromDate = $event"
    @update:to-date="toDate = $event"
    @update:search-query="searchQuery = $event"
    @apply-filters="updateDateFilter"
    @update:sort-by="sortBy = $event"
  />
</template>
