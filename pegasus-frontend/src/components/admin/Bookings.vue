<script setup lang="ts">
import { adminApi } from "@/endpoints/admin";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import Button from "../reusables/Button.vue";
import BookingModal from "./BookingModal.vue";

const toast = useToast();
const loading = ref(false);
const error = ref<string | null>(null);
const availableBookings = ref<BookingResponseDto[]>([]);
const openBookingModal = ref(false);
const selectedBookingId = ref<number | null>(null);

const openBookingDetails = (bookingId: number) => {
  selectedBookingId.value = bookingId;
  openBookingModal.value = true;
};

const closeModal = () => {
  openBookingModal.value = false;
  selectedBookingId.value = null;
};

const getBookings = async () => {
  try {
    loading.value = false;
    error.value = null;
    const response = await adminApi.getAvailableBookings();
    console.log(response);
    if (Array.isArray(response.data)) {
      availableBookings.value = response.data;
    } else {
      availableBookings.value = [response.data];
    }
  } catch (err) {
    error.value = "Failed to fetch the bookings";
    toast.error("Failed to fetch the bookings");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await getBookings();
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold text-gray-900">Bookings</h1>
        <p class="mt-2 text-sm text-gray-700">
          A list of all the available and current bookings.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          type="button"
          class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add booking
        </button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div
            class="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg"
          >
            <table class="relative min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Pick Up Time
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Pick Up Adress
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Drop off Adress
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Price
                  </th>
                  <th scope="col" class="py-3.5 pr-4 pl-3 sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="booking in availableBookings">
                  <td
                    class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6"
                  >
                    {{ new Date(booking.pickUpDateTime).toLocaleString() }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ booking.pickUpAddress }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ booking.dropOffAddress }}
                  </td>
                  <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                    {{ booking.price }} SEK
                  </td>
                  <td
                    class="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                  >
                    <Button @click="openBookingDetails(booking.bookingId)"
                      >See more details</Button
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
  <BookingModal
    
    :open="openBookingModal"
    :booking-id="selectedBookingId"
    @close="closeModal"
  />
</template>
