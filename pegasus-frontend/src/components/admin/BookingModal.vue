<script setup lang="ts">
import { ref, watch } from "vue";
import Modal from "../reusables/Modal.vue";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import { useToast } from "vue-toastification";
import { adminApi } from "@/endpoints/admin";

const bookingDetails = ref<BookingResponseDto | null>(null);
const toast = useToast();
const loading = ref(false);
const error = ref<string | null>(null);

const props = defineProps<{
  open: boolean;
  bookingId?: number | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

watch(
  () => props.bookingId,
  (newId) => {
    if (newId && props.open) {
      getBookingById(newId);
    }
  },
  { immediate: true }
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.bookingId) {
      getBookingById(props.bookingId);
    } else if (!isOpen) {
      bookingDetails.value = null;
      error.value = null;
    }
  }
);

const getBookingById = async (id: number) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await adminApi.getBookingByID(id);
    bookingDetails.value = response.data;
    console.log(bookingDetails.value);
  } catch (err) {
    error.value = "Error fetching booking details";
    toast.error("Error fetching bookings details");
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  emit("close");
};

const formatDateTime = (date: Date | string) => {
  return new Date(date).toLocaleString();
};
</script>

<template>
  <div>
    <Modal lg :open="props.open" @close="handleClose">
      <h3 class="text-3xl mb-2">Booking Details</h3>
      <div
        class="overflow-hidden rounded-md bg-white shadow-sm max-w-4xl max-h-96 overflow-y-auto"
      >
        <div v-if="loading" class="px-6 py-4 text-center">
          Loading booking details...
        </div>

        <div v-else-if="error" class="px-6 py-4 text-red-600">
          {{ error }}
        </div>

        <div v-else-if="bookingDetails" class="divide-y divide-gray-200">
          <!-- Basic Information -->
          <div class="px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Booking Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="font-medium text-gray-700">Booking ID:</span>
                <span class="ml-2">{{ bookingDetails.bookingId }}</span>
              </div>

              <div>
                <span class="font-medium text-gray-700">Guest Booking:</span>
                <span class="ml-2">{{
                  bookingDetails.isGuestBooking ? "Yes" : "No"
                }}</span>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Customer Information
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="font-medium text-gray-700">Name:</span>
                <span class="ml-2"
                  >{{ bookingDetails.firstName }}
                  {{ bookingDetails.lastName }}</span
                >
              </div>
              <div>
                <span class="font-medium text-gray-700">Email:</span>
                <span class="ml-2">{{ bookingDetails.email }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Phone:</span>
                <span class="ml-2">{{ bookingDetails.phoneNumber }}</span>
              </div>
              <div v-if="bookingDetails.flightnumber">
                <span class="font-medium text-gray-700">Flight Number:</span>
                <span class="ml-2">{{ bookingDetails.flightnumber }}</span>
              </div>
            </div>
          </div>

          <!-- Trip Details -->
          <div class="px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Trip Details</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="font-medium text-gray-700">Booking Date:</span>
                <span class="ml-2">{{
                  formatDateTime(bookingDetails.bookingDateTime)
                }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Pick-up Date:</span>
                <span class="ml-2">{{
                  formatDateTime(bookingDetails.pickUpDateTime)
                }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Distance:</span>
                <span class="ml-2">{{ bookingDetails.distanceKm }} km</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Duration:</span>
                <span class="ml-2"
                  >{{ bookingDetails.durationMinutes }} minutes</span
                >
              </div>
              <div>
                <span class="font-medium text-gray-700">Price:</span>
                <span class="ml-2">{{ bookingDetails.price }} SEK</span>
              </div>
              <div v-if="bookingDetails.driverId">
                <span class="font-medium text-gray-700">Driver ID:</span>
                <span class="ml-2">{{ bookingDetails.driverId }}</span>
              </div>
            </div>
          </div>

          <!-- Addresses -->
          <div class="px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              Route Information
            </h3>
            <div class="space-y-3">
              <div>
                <span class="font-medium text-gray-700">Pick-up Address:</span>
                <div class="ml-2 text-sm text-gray-600">
                  {{ bookingDetails.pickUpAddress }}
                  <span class="text-xs text-gray-500">
                    ({{ bookingDetails.pickUpLatitude }},
                    {{ bookingDetails.pickUpLongitude }})
                  </span>
                </div>
              </div>

              <div v-if="bookingDetails.firstStopAddress">
                <span class="font-medium text-gray-700">First Stop:</span>
                <div class="ml-2 text-sm text-gray-600">
                  {{ bookingDetails.firstStopAddress }}
                  <span class="text-xs text-gray-500">
                    ({{ bookingDetails.firstStopLatitude }},
                    {{ bookingDetails.firstStopLongitude }})
                  </span>
                </div>
              </div>

              <div v-if="bookingDetails.secondStopAddress">
                <span class="font-medium text-gray-700">Second Stop:</span>
                <div class="ml-2 text-sm text-gray-600">
                  {{ bookingDetails.secondStopAddress }}
                </div>
              </div>

              <div>
                <span class="font-medium text-gray-700">Drop-off Address:</span>
                <div class="ml-2 text-sm text-gray-600">
                  {{ bookingDetails.dropOffAddress }}
                </div>
              </div>

              <div>
                <span class="font-medium text-gray-700">Driver:</span>
                <div class="ml-2 text-sm text-gray-600">
                  {{ bookingDetails.driverId ? bookingDetails.driverId : 'Ingen förare'  }}
                </div>
              </div>
            </div>
          </div>

          <!-- Comments -->
          <div v-if="bookingDetails.comment" class="px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Comments</h3>
            <p class="text-gray-600">{{ bookingDetails.comment }}</p>
          </div>
        </div>

        <div v-else class="px-6 py-4 text-gray-500 text-center">
          No booking details available
        </div>
      </div>
    </Modal>
  </div>
</template>
