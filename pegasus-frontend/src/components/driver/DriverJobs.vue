<script lang="ts" setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import {
  type BookingSearchRequestDto,
  BookingStatus,
  getBookingStatusString,
  SortOrder,
} from "@/types/booking";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import { debounce } from "lodash-es";
import Button from "../reusables/Button.vue";
import { driverApi } from "@/endpoints/driver";
import GoogleMap from "./GoogleMap.vue";
import Modal from "../reusables/Modal.vue";
import BasePagination from "../reusables/BasePagination.vue";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  XMarkIcon,
  MapIcon,
  UserIcon,
  ReceiptPercentIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "vue-toastification";
import CustomerBookingFilter from "../reusables/CustomerBookingFilter.vue";
import CancelButton from "../reusables/CancelButton.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import type { DriverResponseDto, ReceiptRequestDto } from "@/types/driver-info";
import TextInput from "../reusables/Forms/TextInput.vue";
import NumberInput from "../reusables/Forms/NumberInput.vue";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";

const bookings = ref<BookingResponseDto[]>([]);
const driverInfo = ref<DriverResponseDto>();
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
const openCustomerModal = ref(false);
const openDeleteModal = ref(false);
const openReceiptModal = ref(false);

const activeDropdown = ref<number | null>(null);
const dropdownPosition = ref({
  top: 0,
  left: 0,
  direction: "down" as "up" | "down",
});

const selectedBookingId = ref<number | null>(null);
const toast = useToast();

const searchQuery = ref<BookingSearchRequestDto>({
  page: 1,
  pageSize: 4,
  sortBy: "pickUpDateTime",
  sortOrder: SortOrder.Asc,
  upcomingOnly: true,
});

const selectedBooking = computed(() => {
  return (
    bookings.value.find((b) => b.bookingId === selectedBookingId.value) || null
  );
});

const receiptForm = ref<ReceiptRequestDto>({
  bookingId: 0,
  customerFirstname: "",
  pickupAddress: "",
  stops: "",
  destination: "",
  driverFirstname: "",
  licensePlate: "",
  driverImageUrl: undefined,
  pickupTime: new Date().toISOString(),
  distanceKm: 0,
  durationMinutes: "",
  totalPrice: 0,
});

// Dropdown functions
const openDropdown = (event: MouseEvent, bookingId: number) => {
  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const menuHeight = 280;

  const direction =
    spaceBelow >= menuHeight || spaceBelow > spaceAbove ? "down" : "up";

  const left = rect.right - 224;
  const top =
    direction === "down" ? rect.bottom + 8 : rect.top - menuHeight - 8;

  dropdownPosition.value = { top, left, direction };
  activeDropdown.value = bookingId;
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

const handleClickOutside = (event: Event) => {
  if (activeDropdown.value !== null) {
    const target = event.target as HTMLElement;
    if (
      !target.closest(".dropdown-menu") &&
      !target.closest(".dropdown-button")
    ) {
      closeDropdown();
    }
  }
};

const fetchBookings = async () => {
  try {
    isLoading.value = true;
    const response = await driverApi.getDriversBookings(searchQuery.value);

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

const deleteBooking = async (bookingId: number) => {
  try {
    isLoading.value = true;
    await driverApi.cancelBooking(bookingId);
    toast.success("The booking was cancelled!");
  } catch (error) {
    console.error("Error deleting booking:", error);
    toast.error("Error deleting the booking");
  } finally {
    isLoading.value = false;
    fetchBookings();
    closeDropdown();
  }
};

const completeBooking = async (bookingId: number) => {
  try {
    isLoading.value = true;
    await driverApi.completeBooking(bookingId);
    toast.success("The booking is completed");
  } catch (error) {
    console.error("Error completing booking");
    toast.error("Error completing booking");
  } finally {
    isLoading.value = false;
    fetchBookings();
    closeDropdown();
  }
};

const getDriverInfo = async () => {
  try {
    const response = await driverApi.getDriverInfo();
    driverInfo.value = response.data;
  } catch (error) {
    console.error("Error fetching driver info:", error);
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

const openReceiptForm = async (bookingId: number) => {
  selectedBookingId.value = bookingId;
  const booking = bookings.value.find((b) => b.bookingId === bookingId);
  if (!booking) return;

  if (!driverInfo.value) {
    await getDriverInfo();
  }

  const pickupDate = new Date(booking.pickUpDateTime);
  const year = pickupDate.getFullYear();
  const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
  const day = String(pickupDate.getDate()).padStart(2, "0");
  const hours = String(pickupDate.getHours()).padStart(2, "0");
  const minutes = String(pickupDate.getMinutes()).padStart(2, "0");
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  receiptForm.value = {
    bookingId: booking.bookingId,
    customerFirstname: booking.firstName,
    pickupAddress: booking.pickUpAddress,
    stops: booking.firstStopAddress ?? "No stops",
    destination: booking.dropOffAddress,
    driverFirstname: driverInfo.value?.firstName ?? "",
    licensePlate: driverInfo.value?.carLicensePlate ?? "",
    driverImageUrl: driverInfo.value?.profilePicture,
    pickupTime: formattedDateTime,
    distanceKm: booking.distanceKm ?? 0,
    durationMinutes: Math.round(
      Number(booking.durationMinutes) || 0
    ).toString(),
    totalPrice: booking.price,
  };

  openReceiptModal.value = true;
  closeDropdown();
};

const submitReceipt = async () => {
  try {
    const submitData = {
      ...receiptForm.value,
      pickupTime: new Date(receiptForm.value.pickupTime).toISOString(),
      durationMinutes: Math.round(
        parseFloat(receiptForm.value.durationMinutes) || 0
      ).toString(),
      distanceKm: Number(receiptForm.value.distanceKm) || 0,
      totalPrice: Number(receiptForm.value.totalPrice) || 0,
      bookingId: Number(receiptForm.value.bookingId),
    };

    await driverApi.sendReceipt(submitData);
    toast.success("Receipt sent successfully!");
    openReceiptModal.value = false;
  } catch (error) {
    console.error("Failed to send receipt:", error);
    toast.error("Failed to send receipt.");
  }
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
  if (!searchQuery.value.upcomingOnly) count++;
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

  if (address.length > 30) {
    const words = address.split(" ");
    const mid = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, mid).join(" ");
    const secondLine = words.slice(mid).join(" ");
    return `${firstLine}\n${secondLine}`;
  }

  return address;
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

onMounted(() => {
  fetchBookings();
  getDriverInfo();
  document.addEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="bg-white p-4 m-4 rounded-2xl flex flex-col gap-4">
    <!-- Search filters -->
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="p-3">
          <h1 class="text-3xl font-semibold text-gray-900">
            Incoming Bookings
          </h1>
          <div class="sm:flex-auto">
            <p class="mt-2 text-sm text-gray-700">
              A list of all your accepted bookings. To see only upcoming
              bookings, change it inside the filter.
            </p>
          </div>
          <div class="mt-4 flex gap-4 items-center flex-col sm:flex-row">
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
              Filters
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
              <div class="text-sm text-gray-500">
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
                <span class="font-medium">From:</span>
                {{ booking.pickUpAddress }}
              </div>
              <div>
                <span class="font-medium">To:</span>
                {{ booking.dropOffAddress }}
              </div>
            </div>
            <div
              class="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-3"
            >
              <Button
                @click="
                  () => {
                    selectedBookingId = booking.bookingId;
                    openMapModal = true;
                  }
                "
                class="flex-1 sm:flex-none"
              >
                Trajectory
              </Button>

              <Button
                @click="
                  () => {
                    selectedBookingId = booking.bookingId;
                    openCustomerModal = true;
                  }
                "
                class="flex-1 sm:flex-none"
              >
                Customer
              </Button>

              <button
                @click="(e) => openDropdown(e, booking.bookingId)"
                class="dropdown-button inline-flex items-center justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex-1 sm:flex-none"
              >
                Options
                <ChevronDownIcon
                  class="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block mt-2">
          <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-1"
            >
              <div class="shadow-sm outline-1 outline-black/5 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
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
                        Pick Up Address
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Drop off Address
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Price
                      </th>
                      <th scope="col" class="py-3.5 pr-4 pl-3 sm:pr-6">
                        <span class="sr-only">Actions</span>
                      </th>
                      <th scope="col" class="py-3.5 pr-4 pl-3 sm:pr-6">
                        <span class="sr-only">Status</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-if="bookings.length === 0">
                      <td
                        colspan="6"
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
                        class="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6"
                      >
                        <button
                          @click="(e) => openDropdown(e, booking.bookingId)"
                          class="dropdown-button inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          Options
                          <ChevronDownIcon
                            class="-mr-1 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </button>
                      </td>
                      <td
                        class="py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6"
                      >
                        <span :class="getStatusColor(booking.status)">
                          {{ getBookingStatusString(booking.status) }}
                        </span>
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

  <!-- Teleport dropdown menu to body -->
  <Teleport to="body">
    <div
      v-if="activeDropdown !== null"
      class="dropdown-menu fixed z-[9999] w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
      :style="{
        top: dropdownPosition.top + 'px',
        left: dropdownPosition.left + 'px',
      }"
    >
      <div class="py-1">
        <button
          type="button"
          @click="
            () => {
              selectedBookingId = activeDropdown;
              openMapModal = true;
              closeDropdown();
            }
          "
          class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <MapIcon class="mr-3 h-5 w-5 text-gray-400" />
          Trajectory
        </button>

        <button
          type="button"
          @click="
            () => {
              selectedBookingId = activeDropdown;
              openCustomerModal = true;
              closeDropdown();
            }
          "
          class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <UserIcon class="mr-3 h-5 w-5 text-gray-400" />
          Customer
        </button>

        <button
          type="button"
          @click="
            () => {
              selectedBookingId = activeDropdown;
              openDeleteModal = true;
              closeDropdown();
            }
          "
          class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <XMarkIcon class="mr-3 h-5 w-5 text-gray-400" />
          Cancel
        </button>

        <button
          type="button"
          @click="() => openReceiptForm(activeDropdown!)"
          class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <ReceiptPercentIcon class="mr-3 h-5 w-5 text-gray-400" />
          Send receipt
        </button>

        <button
          type="button"
          @click="() => completeBooking(activeDropdown!)"
          class="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          <CheckCircleIcon class="mr-3 h-5 w-5 text-gray-400" />
          Mark as completed
        </button>
      </div>
    </div>
  </Teleport>

  <!-- Modals -->
  <Modal :open="openCustomerModal" @close="openCustomerModal = false">
    <h3 class="mb-5 font-bold text-2xl">Customer Information</h3>
    <ul class="divide-y divide-gray-200">
      <li class="py-3">
        <strong>Name:</strong> {{ selectedBooking?.firstName }}
        {{ selectedBooking?.lastName }}
      </li>
      <li class="py-3">
        <strong>Phone:</strong> {{ selectedBooking?.phoneNumber }}
      </li>
      <li class="py-3"><strong>Email:</strong> {{ selectedBooking?.email }}</li>
      <li v-if="selectedBooking?.flightnumber" class="py-3">
        <strong>Flight number:</strong> {{ selectedBooking?.flightnumber }}
      </li>
      <li v-if="selectedBooking?.flightnumber" class="py-4">
        <strong>Comments:</strong> {{ selectedBooking?.comment }}
      </li>
    </ul>
  </Modal>

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

  <Modal :open="openDeleteModal" @close="openDeleteModal = false">
    <DialogPanel>
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
        >
          <ExclamationTriangleIcon
            class="size-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <DialogTitle as="h3" class="text-xl font-semibold text-gray-900"
            >Cancel booking</DialogTitle
          >
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to cancel the booking? This action cannot be
              undone.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-5">
        <CancelButton
          @click="() => {deleteBooking(selectedBooking?.bookingId!); openDeleteModal = false; }"
        >
          Yes
        </CancelButton>
        <Button @click="openDeleteModal = false"> No </Button>
      </div>
    </DialogPanel>
  </Modal>

  <Modal :open="openReceiptModal" @close="openReceiptModal = false">
    <h3 class="mb-5 font-bold text-2xl">Send Receipt</h3>
    <div class="space-y-4">
      <TextInput
        :editing-field="true"
        type="datetime-local"
        name="pickup-time"
        v-model="receiptForm.pickupTime"
        >Pickup Time</TextInput
      >
      <NumberInput
        v-model.number="receiptForm.distanceKm"
        name="distance-km"
        type="number"
        :min-value="1"
        :max-value="300"
        :editing-field="true"
        :is-valid="true"
        class="outline-gray-300! focus:outline-pg-persian!"
        >Distance (km)</NumberInput
      >
      <TextInput
        name="duration-minutes"
        type="text"
        v-model="receiptForm.durationMinutes"
        >Duration (minutes)</TextInput
      >
      <NumberInput
        name="total-price"
        type="number"
        :min-value="1"
        :max-value="10000"
        :editing-field="true"
        :is-valid="true"
        class="outline-gray-300! focus:outline-pg-persian!"
        v-model.number="receiptForm.totalPrice"
        >Total Price (SEK)</NumberInput
      >
    </div>
    <div class="mt-5 flex justify-end gap-3">
      <Button @click="submitReceipt">Send</Button>
      <Button @click="openReceiptModal = false" variant="secondary"
        >Cancel</Button
      >
    </div>
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
