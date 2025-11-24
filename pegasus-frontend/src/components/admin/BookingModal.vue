<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import type { UpdateBookingDto } from "@/types/update-booking-dto";
import { useToast } from "vue-toastification";
import { adminApi } from "@/endpoints/admin";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { BookingStatus, getBookingStatusString } from "@/types/booking";
import Button from "../reusables/Button.vue";
import CancelButton from "../reusables/CancelButton.vue";
import AutoCompleteInput from "../reusables/AutoCompleteInput.vue";
import { formatHours } from "@/utils/timeFormatter";
import TextInput from "../reusables/Forms/TextInput.vue";
import { validateFlightNumber } from "@/utils/flightValidator";
import { validateBookingDateTime } from "@/utils/auth/time48HoursValidator";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";
import SelectDriver from "./SelectDriver.vue";
import DriverInfoCard from "../reusables/DriverInfoCard.vue";

const bookingDetails = ref<BookingResponseDto | null>(null);
const loading = ref(false);
const updateLoading = ref(false);
const error = ref<string | null>(null);
const isEditing = ref(false);
const toast = useToast();
const showDriverModal = ref(false);

const props = defineProps<{
  open: boolean;
  bookingId?: number | null;
}>();

const emit = defineEmits<{
  close: [];
  updated: [booking: BookingResponseDto];
}>();

const editForm = reactive<Record<string, any>>({});

const isDateTimeValid = computed(() => {
  return (
    !editForm.pickUpDateTime || validateBookingDateTime(editForm.pickUpDateTime)
  );
});

const isFlightNumberValid = computed(() => {
  return !editForm.flightnumber || validateFlightNumber(editForm.flightnumber);
});
const hasRequiredFields = computed(() => {
  return !!(
    editForm.pickUpDateTime?.trim() &&
    editForm.pickUpAddress?.trim() &&
    editForm.dropOffAddress?.trim()
  );
});

const canSubmit = computed(() => {
  return (
    hasRequiredFields.value &&
    isDateTimeValid.value &&
    isFlightNumberValid.value
  );
});

const canEditBooking = computed(() => {
  if (!bookingDetails.value) return false;
  const status = bookingDetails.value.status;
  return (
    status !== BookingStatus.Completed && status !== BookingStatus.Cancelled
  );
});

watch(
  () => props.bookingId,
  (newId) => {
    if (newId && props.open) getBookingById(newId);
  },
  { immediate: true }
);

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && props.bookingId) {
      await getBookingById(props.bookingId);
    } else {
      resetComponent();
    }
  }
);
const handlePickupCoordinatesCleared = () => {
  editForm.pickUpLatitude = null;
  editForm.pickUpLongitude = null;
};

const handleFirstStopCoordinatesCleared = () => {
  editForm.firstStopLatitude = null;
  editForm.firstStopLongitude = null;
};

const handleSecondStopCoordinatesCleared = () => {
  editForm.secondStopLatitude = null;
  editForm.secondStopLongitude = null;
};

const handleDropOffCoordinatesCleared = () => {
  editForm.dropOffLatitude = null;
  editForm.dropOffLongitude = null;
};
// addresses
const handlePickupAddressSelected = (place: any) => {
  editForm.pickUpAddress = place.formatted_address || place.description;
  editForm.pickUpLatitude = place.lat || place.latitude;
  editForm.pickUpLongitude = place.lng || place.longitude;
};

const handleFirstStopAddressSelected = (place: any) => {
  editForm.firstStopAddress = place.formatted_address || place.description;
  editForm.firstStopLatitude = place.lat || place.latitude;
  editForm.firstStopLongitude = place.lng || place.longitude;
};

const handleSecondStopAddressSelected = (place: any) => {
  editForm.secondStopAddress = place.formatted_address || place.description;
  editForm.secondStopLatitude = place.lat || place.latitude;
  editForm.secondStopLongitude = place.lng || place.longitude;
};

const handleDropOffAddressSelected = (place: any) => {
  editForm.dropOffAddress = place.formatted_address || place.description;
  editForm.dropOffLatitude = place.lat || place.latitude;
  editForm.dropOffLongitude = place.lng || place.longitude;
};

// methods
const getBookingById = async (id: number) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await adminApi.getBookingByID(id);
    bookingDetails.value = response.data;
  } catch (err) {
    error.value = "Error fetching booking details";
    toast.error("Error fetching booking details");
  } finally {
    loading.value = false;
  }
};

const startEditing = () => {
  if (!bookingDetails.value) return;
  isEditing.value = true;

  const booking = bookingDetails.value;
  Object.assign(editForm, {
    bookingId: booking.bookingId,
    pickUpDateTime: formatDateTimeForInput(booking.pickUpDateTime),
    pickUpAddress: booking.pickUpAddress,
    pickUpLatitude: booking.pickUpLatitude,
    pickUpLongitude: booking.pickUpLongitude,
    firstStopAddress: booking.firstStopAddress || "",
    firstStopLatitude: booking.firstStopLatitude || 0,
    firstStopLongitude: booking.firstStopLongitude || 0,
    secondStopAddress: booking.secondStopAddress || "",
    secondStopLatitude: booking.secondStopLatitude || 0,
    secondStopLongitude: booking.secondStopLongitude || 0,
    dropOffAddress: booking.dropOffAddress,
    dropOffLatitude: booking.dropOffLatitude,
    dropOffLongitude: booking.dropOffLongitude,
    flightnumber: booking.flightnumber || "",
    comment: booking.comment || "",
  });
};

const cancelEditing = () => {
  isEditing.value = false;
  Object.assign(editForm, {});
};

const cancelBoking = async (id: number) => {
  try {
    loading.value = true;
    error.value = null;
    await adminApi.cancelBooking(id);
    toast.success("The booking was cancelled!");
  } catch (error) {
    toast.error(
      "Failed to update booking. A booking can be cancelled 24 hours before."
    );
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handleUpdateBooking = async () => {
  if (!editForm.bookingId && !canSubmit.value) return;

  try {
    updateLoading.value = true;
    error.value = null;

    const updateData: UpdateBookingDto = {
      bookingId: editForm.bookingId,
      pickUpDateTime: editForm.pickUpDateTime!,
      pickUpAddress: editForm.pickUpAddress!,
      pickUpLatitude: editForm.pickUpLatitude!,
      pickUpLongitude: editForm.pickUpLongitude!,
      dropOffAddress: editForm.dropOffAddress!,
      dropOffLatitude: editForm.dropOffLatitude!,
      dropOffLongitude: editForm.dropOffLongitude!,
      ...(editForm.firstStopAddress?.trim() &&
        editForm.firstStopLatitude &&
        editForm.firstStopLongitude && {
          firstStopAddress: editForm.firstStopAddress,
          firstStopLatitude: editForm.firstStopLatitude,
          firstStopLongitude: editForm.firstStopLongitude,
        }),
      ...(editForm.secondStopAddress?.trim() &&
        editForm.secondStopLatitude &&
        editForm.secondStopLongitude && {
          secondStopAddress: editForm.secondStopAddress,
          secondStopLatitude: editForm.secondStopLatitude,
          secondStopLongitude: editForm.secondStopLongitude,
        }),
      ...(editForm.flightnumber?.trim() && {
        flightnumber: editForm.flightnumber,
      }),
      ...(editForm.comment?.trim() && { comment: editForm.comment }),
    };

    const response = await adminApi.updateBooking(updateData);
    bookingDetails.value = response.data;
    toast.success("Booking updated successfully");
    emit("updated", response.data);
    isEditing.value = false;
  } catch (err) {
    error.value = "Error updating booking";
    toast.error("Error updating booking");
  } finally {
    updateLoading.value = false;
  }
};

const resetComponent = () => {
  bookingDetails.value = null;
  error.value = null;
  isEditing.value = false;
  Object.assign(editForm, {});
};

const handleClose = () => emit("close");
const formatDateTime = (date: Date | string) => new Date(date).toLocaleString();
const formatDateTimeForInput = (date: Date | string) =>
  new Date(date).toISOString().slice(0, 16);

const handleDriverAssigned = async (driverId: string) => {
  try {
    showDriverModal.value = false;
    if (bookingDetails.value) {
      bookingDetails.value.driverId = driverId;
    }

    if (bookingDetails.value?.bookingId) {
      await getBookingById(bookingDetails.value.bookingId);
    }
  } catch (error) {
    console.error("Error in handleDriverAssigned:", error);
    toast.error("Failed to refresh booking data");
  }
};
const showDriverContactModal = ref(false);

const driverInfo = computed(() => {
  if (!bookingDetails.value?.driverId) return null;

  return {
    id: bookingDetails.value.driverId,
    name: bookingDetails.value.driverName || "Unknown Driver",
    phoneNumber: bookingDetails.value.driverPhoneNumber || "",
    profilePicture: bookingDetails.value.driverProfilePicture,
    carMake: bookingDetails.value.driverCarMake,
    carModel: bookingDetails.value.driverCarModel,
    licensePlate: bookingDetails.value.driverCarLicensePlate,
  };
});

const showDriverInfo = () => {
  showDriverContactModal.value = true;
};

const handleDriverModalClose = () => {
  showDriverContactModal.value = false;
};

const driverCarInfo = computed(() => {
  if (!bookingDetails.value) return "";
  const make = bookingDetails.value.driverCarMake || "";
  const model = bookingDetails.value.driverCarModel || "";
  const plate = bookingDetails.value.driverCarLicensePlate || "";

  const car = [make, model].filter(Boolean).join(" ");
  return plate ? `${car} (${plate})` : car;
});
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-10" @close="handleClose">
      <div
        class="fixed inset-0 bg-opacity-75 backdrop-blur-xs transition-opacity"
      ></div>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16 mb-16 md:mb-0"
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
              <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                <div
                  class="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl"
                >
                  <!-- Header -->
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="text-lg font-semibold text-gray-900">
                        {{ isEditing ? "Edit Booking" : "Booking Details" }}
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center space-x-2">
                        <Button
                          v-if="!isEditing && bookingDetails && canEditBooking"
                          @click="startEditing"
                        >
                          Edit Booking
                        </Button>
                        <div
                          v-else-if="
                            !isEditing && bookingDetails && !canEditBooking
                          "
                          class="text-sm text-gray-500"
                        >
                          Cannot edit
                          {{
                            getBookingStatusString(
                              bookingDetails.status
                            ).toLowerCase()
                          }}
                          booking
                        </div>
                        <button
                          type="button"
                          class="relative cursor-pointer rounded-md text-gray-400 hover:text-gray-500"
                          @click="handleClose"
                        >
                          <XMarkIcon class="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <!-- Loading -->
                    <div v-if="loading">
                      <TaxiSpinner size="large" />
                      <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                      ></div>
                    </div>

                    <!-- Error -->
                    <div
                      v-else-if="error"
                      class="text-center py-8 text-red-600"
                    >
                      {{ error }}
                    </div>

                    <!-- Booking Details -->
                    <div v-else-if="bookingDetails" class="space-y-6">
                      <!-- Status Alert -->
                      <div
                        v-if="!canEditBooking"
                        class="rounded-md bg-yellow-50 p-4"
                      >
                        <h3 class="text-sm font-medium text-yellow-800">
                          Booking Status:
                          {{ getBookingStatusString(bookingDetails.status) }}
                        </h3>
                        <p class="mt-2 text-sm text-yellow-700">
                          This booking cannot be edited because it is
                          {{
                            getBookingStatusString(
                              bookingDetails.status
                            ).toLowerCase()
                          }}.
                        </p>
                      </div>

                      <!-- Customer Information -->
                      <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-sm font-medium text-gray-900 mb-3">
                          Customer Information
                        </h3>
                        <div
                          class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
                        >
                          <div>
                            <span class="text-gray-500">Name:</span>
                            <p class="font-medium">
                              {{ bookingDetails.firstName }}
                              {{ bookingDetails.lastName }}
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Email:</span>
                            <p class="font-medium">
                              {{ bookingDetails.email }}
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Phone:</span>
                            <p class="font-medium">
                              {{ bookingDetails.phoneNumber }}
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Guest Booking:</span>
                            <p class="font-medium">
                              {{ bookingDetails.isGuestBooking ? "Yes" : "No" }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Booking Information -->
                      <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-sm font-medium text-gray-900 mb-3">
                          Booking Information
                        </h3>
                        <div
                          class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
                        >
                          <div>
                            <span class="text-gray-500">Booking ID:</span>
                            <p class="font-medium">
                              #{{ bookingDetails.bookingId }}
                            </p>
                          </div>

                          <div>
                            <span class="text-gray-500">Price:</span>
                            <p class="font-medium">
                              {{
                                new Intl.NumberFormat("sv-SE", {
                                  style: "currency",
                                  currency: "SEK",
                                }).format(bookingDetails.price)
                              }}
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Confirmed:</span>
                            <p class="font-medium">
                              {{ bookingDetails.isConfirmed ? "Yes" : "No" }}
                            </p>
                          </div>
                          <div>
                            <div v-if="bookingDetails.status === 2"></div>
                            <div v-else-if="bookingDetails.status === 0">
                              <span class="text-gray-500">Assign Driver:</span>
                              <p class="font-medium text-yellow-600 mb-2">
                                Driver cant be assigned if the customer has not
                                verified his booking
                              </p>
                            </div>
                            <div v-else-if="!bookingDetails.driverId">
                              <p class="font-medium text-yellow-600 mb-2">
                                A driver is not assigned yet
                              </p>
                              <button
                                @click="showDriverModal = true"
                                class="rounded-md cursor-pointer bg-pg-persian px-2 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-pg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-300"
                              >
                                Assign Driver
                              </button>

                              <SelectDriver
                                :booking-id="bookingDetails.bookingId"
                                :is-open="showDriverModal"
                                @close="showDriverModal = false"
                                @driver-assigned="handleDriverAssigned"
                              />
                            </div>
                            <div v-else class="space-y-2">
                              <span class="text-gray-500">Driver:</span>
                              <div class="flex items-center justify-between">
                                <div>
                                  <p class="font-medium">
                                    {{ bookingDetails.driverName }}
                                  </p>
                                  <p
                                    v-if="driverCarInfo"
                                    class="text-sm text-gray-600"
                                  ></p>
                                </div>
                                <Button
                                  @click="showDriverInfo"
                                  class="text-sm px-3 py-1"
                                  variant="outline"
                                >
                                  Contact Driver
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Trip Details -->
                      <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-md font-medium text-gray-900 mb-3">
                          Trip Details
                        </h3>

                        <!-- Edit Form -->
                        <form
                          v-if="isEditing"
                          @submit.prevent="handleUpdateBooking"
                          class="space-y-4"
                        >
                          <!-- Pick Up Date Time -->

                          <div>
                            <TextInput
                              v-model="editForm.pickUpDateTime"
                              name="pickup-time"
                              type="datetime-local"
                              :is-valid="isDateTimeValid"
                              class="mt-1 block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                              >Pick Up Date & Time</TextInput
                            >
                            <p
                              v-if="!isDateTimeValid"
                              class="mt-1 text-sm text-red-600"
                            >
                              Must be at least 48 hours from now
                            </p>
                          </div>

                          <!-- Pick Up Address with Autocomplete -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-900"
                              >Pick Up Address</label
                            >
                            <AutoCompleteInput
                              v-model="editForm.pickUpAddress"
                              placeholder="Enter pickup address"
                              @place-selected="handlePickupAddressSelected"
                              @coordinates-cleared="
                                handlePickupCoordinatesCleared
                              "
                            />
                          </div>

                          <!-- First Stop Address with Autocomplete -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-900"
                              >First Stop Address (Optional)</label
                            >
                            <AutoCompleteInput
                              v-model="editForm.firstStopAddress"
                              placeholder="Enter first stop address"
                              @place-selected="handleFirstStopAddressSelected"
                              @coordinates-cleared="
                                handleFirstStopCoordinatesCleared
                              "
                            />
                          </div>

                          <!-- Second Stop Address with Autocomplete -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-900"
                              >Second Stop Address (Optional)</label
                            >
                            <AutoCompleteInput
                              v-model="editForm.secondStopAddress"
                              placeholder="Enter second stop address"
                              @place-selected="handleSecondStopAddressSelected"
                              @coordinates-cleared="
                                handleSecondStopCoordinatesCleared
                              "
                            />
                          </div>

                          <!-- Drop Off Address with Autocomplete -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-900"
                              >Drop Off Address</label
                            >
                            <AutoCompleteInput
                              v-model="editForm.dropOffAddress"
                              placeholder="Enter drop-off address"
                              @place-selected="handleDropOffAddressSelected"
                              @coordinates-cleared="
                                handleDropOffCoordinatesCleared
                              "
                            />
                          </div>

                          <!-- Flight Number -->
                          <div>
                            <TextInput
                              name="flight-number"
                              v-model="editForm.flightnumber"
                              type="text"
                              :is-valid="isFlightNumberValid"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              >Flight Number (Required to Arlanda)</TextInput
                            >
                            <p
                              v-if="
                                editForm.flightnumber?.trim() &&
                                !isFlightNumberValid
                              "
                              class="mt-1 text-sm text-red-600"
                            >
                              Invalid flight number format
                            </p>
                          </div>

                          <!-- Comment -->
                          <div>
                            <label
                              class="block text-sm font-medium text-gray-900"
                              >Comment (Optional)</label
                            >
                            <textarea
                              v-model="editForm.comment"
                              rows="3"
                              class="mt-1 block w-full rounded-md bg-white p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            ></textarea>
                          </div>

                          <!-- Form Actions -->
                          <div class="flex justify-end space-x-3 pt-4">
                            <CancelButton @click="cancelEditing"
                              >Cancel</CancelButton
                            >
                            <Button type="submit" :disabled="updateLoading">
                              {{
                                updateLoading ? "Updating..." : "Update Booking"
                              }}
                            </Button>
                          </div>
                        </form>

                        <!-- Read-only view -->
                        <div v-else class="space-y-4 text-sm">
                          <div>
                            <span class="text-gray-500"
                              >Pick Up Date & Time:</span
                            >
                            <p class="font-medium">
                              {{
                                new Date(
                                  bookingDetails.pickUpDateTime
                                ).toLocaleString("sv-SE", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: false,
                                })
                              }}
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Pick Up Address:</span>
                            <p class="font-medium">
                              {{ bookingDetails.pickUpAddress }}
                            </p>
                          </div>
                          <div v-if="bookingDetails.firstStopAddress">
                            <span class="text-gray-500">First Stop:</span>
                            <p class="font-medium">
                              {{ bookingDetails.firstStopAddress }}
                            </p>
                          </div>
                          <div v-if="bookingDetails.secondStopAddress">
                            <span class="text-gray-500">Second Stop:</span>
                            <p class="font-medium">
                              {{ bookingDetails.secondStopAddress }}
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Drop Off Address:</span>
                            <p class="font-medium">
                              {{ bookingDetails.dropOffAddress }}
                            </p>
                          </div>
                          <div v-if="bookingDetails.flightnumber">
                            <span class="text-gray-500">Flight Number:</span>
                            <p class="font-medium">
                              {{ bookingDetails.flightnumber }}
                            </p>
                          </div>
                          <div v-if="bookingDetails.comment">
                            <span class="text-gray-500">Comment:</span>
                            <p class="font-medium">
                              {{ bookingDetails.comment }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Trip Stats -->
                      <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-sm font-medium text-gray-900 mb-3">
                          Trip Statistics
                        </h3>
                        <div
                          class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm"
                        >
                          <div>
                            <span class="text-gray-500">Distance:</span>
                            <p class="font-medium">
                              {{ bookingDetails.distanceKm }} km
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Duration:</span>
                            <p class="font-medium">
                              {{ formatHours(bookingDetails.durationMinutes) }}
                            </p>
                          </div>
                          <div>
                            <span class="text-gray-500">Booked:</span>
                            <p class="font-medium">
                              {{
                                formatDateTime(bookingDetails.bookingDateTime)
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="mt-2 flex items-end justify-end">
                        <CancelButton
                          @click="cancelBoking(bookingDetails?.bookingId!)"
                          class="mt-2 flex items-end justify-end"
                          >Cancel booking</CancelButton
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
          <DriverInfoCard
            :open="showDriverContactModal"
            :driver="driverInfo"
            @close="handleDriverModalClose"
          />
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
