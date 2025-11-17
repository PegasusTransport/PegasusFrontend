<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, useRoute } from "vue-router";
import Button from "@/components/reusables/Button.vue";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";
import { userApi } from "@/endpoints/user";
import type { ApiResponse } from "@/types/api-response-dto";

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref<boolean>(false);
const isVerified = ref<boolean>(false);
const verificationFailed = ref<boolean>(false);
const email = ref<string>((route.query.email as string) || "");
const token = ref<string>((route.query.token as string) || "");

const verifyEmail = async () => {
  if (!email.value || !token.value) {
    toast.error("Invalid or missing verification link");
    verificationFailed.value = true;
    return;
  }

  try {
    isLoading.value = true;
    const result = await userApi.verifyEmail({
      email: email.value,
      token: token.value,
    });
    toast.success(result.message);
    isVerified.value = true;
  } catch (error) {
    console.error(error);
    let errorMessage = "Something went wrong";

    if (axios.isAxiosError(error)) {
      const result = error.response?.data as ApiResponse<string> | undefined;
      if (result?.message) {
        errorMessage = result.message;
      }
    }

    toast.error(errorMessage);
    verificationFailed.value = true;
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: "Login" });
};

onMounted(() => {
  verifyEmail();
});
</script>

<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div
        class="bg-pg-secondary px-6 py-12 shadow sm:rounded-lg sm:px-12 border-2 border-white"
      >
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            class="mx-auto h-20 w-auto"
            src="/src/assets/img/Pegasus.png"
            alt="Pegasus Transport logo"
          />

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center mt-6">
            <h2 class="text-2xl/9 font-bold tracking-tight text-gray-900">
              Verifying Email
            </h2>
            <p class="mt-4 text-sm text-gray-600">
              Please wait while we verify your email address...
            </p>
            <div class="mt-6 flex justify-center">
              <TaxiSpinner size="large" />
            </div>
          </div>

          <!-- Success State -->
          <div v-else-if="isVerified" class="text-center mt-6">
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
            >
              <svg
                class="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h2 class="mt-4 text-2xl/9 font-bold tracking-tight text-gray-900">
              Email Verified!
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Your email has been successfully verified. You can now log in to
              your account.
            </p>
            <div class="mt-6">
              <Button
                @click="goToLogin"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6"
              >
                Go to Login
              </Button>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="verificationFailed" class="text-center mt-6">
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"
            >
              <svg
                class="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 class="mt-4 text-2xl/9 font-bold tracking-tight text-gray-900">
              Verification Failed
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              We couldn't verify your email. The link may be invalid or expired.
            </p>
            <div class="mt-6">
              <Button
                @click="verifyEmail"
                :disabled="isLoading"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6 mb-3"
              >
                Try Again
              </Button>
              <Button
                @click="goToLogin"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6 bg-gray-600 hover:bg-gray-700"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-10 text-center text-sm/6 text-white">
        Need help?
        {{ " " }}
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold text-pg-secondary hover:text-pg-accent"
        >
          Contact Support
        </RouterLink>
      </p>
    </div>
  </div>
</template>
