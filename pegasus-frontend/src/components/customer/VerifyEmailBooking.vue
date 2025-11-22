<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import Button from "@/components/reusables/Button.vue";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import { userApi } from "@/endpoints/user";

console.log("VerifyEmailBooking script setup executed");

// Define props
interface Props {
  token?: string;
}

const props = defineProps<Props>();

const toast = useToast();
const router = useRouter();

console.log("Props received:", props);

const isLoading = ref(false);
const isConfirmed = ref<boolean | null>(null);
const bookingData = ref<BookingResponseDto | null>(null);
const errorMessage = ref("");
const token = ref<string>(props.token || "");

console.log("Token from props:", token.value);
console.log("Token type:", typeof token.value);
console.log("Token length:", token.value?.length);

const formattedBookingDate = computed(() => {
  if (!bookingData.value?.bookingDateTime) return "";
  const d = new Date(bookingData.value.bookingDateTime);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString();
});

const confirmBooking = async () => {
  console.log("confirmBooking called");
  console.log("isLoading:", isLoading.value);
  console.log("token.value:", token.value);
  
  if (isLoading.value) {
    console.log("Already loading, returning");
    return;
  }
  
  if (!token.value?.trim()) {
    console.log("No token found");
    isConfirmed.value = false;
    errorMessage.value = "Invalid or missing confirmation token";
    toast.error(errorMessage.value);
    return;
  }

  console.log("Starting API call...");
  isLoading.value = true;
  errorMessage.value = "";

  try {
    console.log("Calling verifyGuestBooking with token:", token.value);
    const result = await userApi.verifyGuestBooking(
      { token: token.value }
    );

    console.log("API result:", result);

    const { data, message, succeeded, errors } = result as any;

    if (succeeded && data) {
      bookingData.value = data;
      isConfirmed.value = true;
      toast.success(message || "Booking confirmed successfully");
    } else {
      isConfirmed.value = false;
      errorMessage.value =
        message || (errors?.[0] as string) || "Failed to confirm booking";
      toast.error(errorMessage.value);
    }
  } catch (e: any) {
    console.error("Error in confirmBooking:", e);
    if (e?.name === "CanceledError" || e?.name === "AbortError") return;
    isConfirmed.value = false;
    errorMessage.value =
      e?.response?.data?.message ||
      e?.message ||
      "An unexpected error occurred";
    console.error("Full error object:", e);
    toast.error("Failed to confirm booking");
  } finally {
    console.log("Setting isLoading to false");
    isLoading.value = false;
  }
};

const goToHome = () => router.push({ name: "Home" });
const goToLogin = () => router.push({ name: "Login" });

console.log("Setting up onMounted hook");

onMounted(() => {
  console.log("=== onMounted FIRED ===");
  console.log("Token in onMounted:", token.value);
  confirmBooking();
});

console.log("Script setup complete");
</script>

<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div
        class="bg-pg-secondary px-6 py-6 shadow sm:rounded-lg sm:px-12 border-2 border-white"
      >
        <div class="space-y-6">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              class="mx-auto h-20 w-auto"
              src="/src/assets/img/Pegasus.webp"
              alt="Pegasus Transport logo"
            />
            <h2
              class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
            >
              Booking Confirmation
            </h2>
          </div>

          <div v-if="isLoading" class="text-center">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"
            ></div>
            <p class="mt-4 text-sm text-gray-600">Confirming your booking...</p>
          </div>

          <div v-else-if="isConfirmed === true" class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
            >
              <svg
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Booking Confirmed!
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Your booking has been successfully confirmed.
            </p>

            <div
              v-if="bookingData"
              class="mt-4 bg-gray-50 rounded-lg p-4 text-left"
            >
              <h4 class="font-medium text-gray-900 mb-2">Booking Details:</h4>
              <div class="space-y-1 text-sm text-gray-600">
                <p v-if="bookingData.bookingId">
                  <span class="font-medium">Booking ID:</span>
                  {{ bookingData.bookingId }}
                </p>
                <p v-if="bookingData.pickUpAddress">
                  <span class="font-medium">Pickup:</span>
                  {{ bookingData.pickUpAddress }}
                </p>
                <p v-if="bookingData.dropOffAddress">
                  <span class="font-medium">Destination:</span>
                  {{ bookingData.dropOffAddress }}
                </p>
                <p v-if="formattedBookingDate">
                  <span class="font-medium">Date:</span>
                  {{ formattedBookingDate }}
                </p>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <Button
                @click="goToHome"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6"
              >
                Continue to Home
              </Button>
            </div>
          </div>

          <div v-else-if="isConfirmed === false" class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
            >
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Confirmation Failed
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              {{
                errorMessage ||
                "We couldn't confirm your booking. The link may be invalid or expired."
              }}
            </p>

            <div class="mt-6 space-y-3">
              <Button
                @click="confirmBooking"
                :disabled="isLoading"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6 bg-red-600 hover:bg-red-500"
              >
                Try Again
              </Button>
              <Button
                @click="goToHome"
                variant="outline"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-10 text-center text-sm/6 text-white space-y-2">
        <p>
          Need help?
          <RouterLink
            :to="{ name: 'Contact' }"
            class="font-semibold text-pg-secondary hover:text-pg-accent"
          >
            Contact Support
          </RouterLink>
        </p>
        <p>
          <RouterLink
            :to="{ name: 'Login' }"
            class="font-semibold text-pg-secondary hover:text-pg-accent"
          >
            Go to Login
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
