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
import {
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
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

  // Ensure driver info is loaded
  if (!driverInfo.value) {
    await getDriverInfo();
  }

  // Convert the booking date to local datetime for the input
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
    // Convert to whole number STRING from the start
    durationMinutes: Math.round(
      Number(booking.durationMinutes) || 0
    ).toString(),
    totalPrice: booking.price,
  };

  openReceiptModal.value = true;
};
const submitReceipt = async () => {
  try {
    const submitData = {
      ...receiptForm.value,
      pickupTime: new Date(receiptForm.value.pickupTime).toISOString(),
      // Ensure durationMinutes is a whole number STRING
      durationMinutes: Math.round(
        parseFloat(receiptForm.value.durationMinutes) || 0
      ).toString(),
      // Ensure numeric fields are properly typed
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

// Track per-booking menu direction
const menuDirections = ref<Record<number, "up" | "down">>({});

// Decide direction when opening
function decideMenuDirection(btnEl: HTMLElement, bookingId: number) {
  const rect = btnEl.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  // Approx menu height ~ 260px
  const needed = 260;
  const direction =
    spaceBelow < needed && spaceAbove > spaceBelow ? "up" : "down";
  menuDirections.value[bookingId] = direction;
}

function onMenuButtonClick(e: MouseEvent, bookingId: number) {
  const target = e.currentTarget as HTMLElement | null;
  if (!target) return;
  // Wait for nextTick so MenuItems mount after open
  nextTick(() => decideMenuDirection(target, bookingId));
}

onMounted(() => {
  fetchBookings();
  getDriverInfo();
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
        <div class="block sm:hidden space-y-4">
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
              <Button
                @click="
                  () => {
                    selectedBookingId = booking.bookingId;
                    openCustomerModal = true;
                  }
                "
                >Customer</Button
              >
            </div>
          </div>
        </div>
        <div class="hidden sm:block mt-2">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-1"
            >
              <div
                class="overflow-visible shadow-sm outline-1 outline-black/5 sm:rounded-lg"
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
                      <td>
                        <Menu as="div" class="relative inline-block">
                          <MenuButton
                            class="cursor-pointer inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50"
                            @click="(e:any) => onMenuButtonClick(e, booking.bookingId)"
                          >
                            Options
                            <ChevronDownIcon
                              class="-mr-1 size-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </MenuButton>
                          <transition
                            enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform scale-100"
                            leave-to-class="transform opacity-0 scale-95"
                          >
                            <MenuItems
                              class="absolute right-0 z-50 w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg outline-1 outline-black/5"
                              v-if="menuDirections[booking.bookingId]"
                              :class="
                                menuDirections[booking.bookingId] === 'down'
                                  ? 'top-full mt-2 origin-top-right'
                                  : 'bottom-full mb-2 origin-bottom-right'
                              "
                            >
                              <div class="py-1">
                                <MenuItem v-slot="{ active }">
                                  <button
                                    type="button"
                                    @click="
                                      () => {
                                        selectedBookingId = booking.bookingId;
                                        openMapModal = true;
                                      }
                                    "
                                    :class="[
                                      'w-full text-left flex items-center px-4 py-2 text-sm rounded',
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                    ]"
                                  >
                                    <MapIcon
                                      :class="[
                                        active
                                          ? 'text-gray-500'
                                          : 'text-gray-400',
                                        'mr-3 size-5',
                                      ]"
                                    />
                                    Trajectory
                                  </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                  <button
                                    type="button"
                                    @click="
                                      () => {
                                        selectedBookingId = booking.bookingId;
                                        openCustomerModal = true;
                                      }
                                    "
                                    :class="[
                                      'w-full text-left flex items-center px-4 py-2 text-sm rounded',
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                    ]"
                                  >
                                    <UserIcon
                                      :class="[
                                        active
                                          ? 'text-gray-500'
                                          : 'text-gray-400',
                                        'mr-3 size-5',
                                      ]"
                                    />
                                    Customer
                                  </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                  <button
                                    type="button"
                                    @click="
                                      () => {
                                        selectedBookingId = booking.bookingId;
                                        openDeleteModal = true;
                                      }
                                    "
                                    :class="[
                                      'w-full text-left flex items-center px-4 py-2 text-sm rounded',
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                    ]"
                                  >
                                    <XMarkIcon
                                      :class="[
                                        active
                                          ? 'text-gray-500'
                                          : 'text-gray-400',
                                        'mr-3 size-5',
                                      ]"
                                    />
                                    Cancel
                                  </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                  <button
                                    type="button"
                                    @click="
                                      () => openReceiptForm(booking.bookingId)
                                    "
                                    :class="[
                                      'w-full text-left flex items-center px-4 py-2 text-sm rounded',
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                    ]"
                                  >
                                    <ReceiptPercentIcon
                                      :class="[
                                        active
                                          ? 'text-gray-500'
                                          : 'text-gray-400',
                                        'mr-3 size-5',
                                      ]"
                                    />
                                    Send receipt
                                  </button>
                                </MenuItem>
                                <MenuItem v-slot="{ active }">
                                  <button
                                    type="button"
                                    @click="
                                      () => completeBooking(booking.bookingId)
                                    "
                                    :class="[
                                      'w-full text-left flex items-center px-4 py-2 text-sm rounded',
                                      active
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700',
                                    ]"
                                  >
                                    <CheckCircleIcon
                                      :class="[
                                        active
                                          ? 'text-gray-500'
                                          : 'text-gray-400',
                                        'mr-3 size-5',
                                      ]"
                                    />
                                    Mark as completed
                                  </button>
                                </MenuItem>
                              </div>
                            </MenuItems>
                          </transition>
                        </Menu>
                      </td>
                      <td>
                        <span :class="getStatusColor(booking.status)">{{
                          getBookingStatusString(booking.status)
                        }}</span>
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
        <Button> No </Button>
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
