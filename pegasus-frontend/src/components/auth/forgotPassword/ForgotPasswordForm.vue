<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { type DefaultField } from "@/hooks/useFormValidation";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import useFormValidation from "@/hooks/useFormValidation";
import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";
import type { RequestPasswordResetDto } from "@/types/request-password-reset-dto";

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const { createDefaultField, validateEmail, isValidForm } = useFormValidation();

const isLoading = ref<boolean>(false);

const email = ref<DefaultField>(createDefaultField());
const validateEmailField = () => validateEmail(email.value);

const hasSent = ref<boolean>(false);
const sendButtonText = computed(() => {
  return hasSent.value ? "Resend reset link" : "Send reset link";
});

// Counter
const COUNT = 120;
const STORAGE_KEY = "password_reset_countdown";
const currentCount = ref<number>(0);
const counting = computed(() => {
  return currentCount.value > 0;
});

let countdownInterval: ReturnType<typeof setInterval> | null = null;

const saveCountdown = () => {
  if (currentCount.value > 0) {
    const expiryTime = Date.now() + currentCount.value * 1000;
    localStorage.setItem(STORAGE_KEY, expiryTime.toString());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

const loadCountdown = () => {
  const savedExpiry = localStorage.getItem(STORAGE_KEY);
  if (savedExpiry) {
    const expiryTime = parseInt(savedExpiry, 10);
    const remainingTime = Math.floor((expiryTime - Date.now()) / 1000);

    if (remainingTime > 0) {
      currentCount.value = remainingTime;
      startCountdown();
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
};

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    currentCount.value--;
    saveCountdown(); // Save on each tick

    if (currentCount.value <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
      localStorage.removeItem(STORAGE_KEY);
    }
  }, 1000);
};

const createPasswordResetRequest = (): RequestPasswordResetDto => {
  return {
    email: email.value.value,
  };
};

const sendPasswordResetRequest = async () => {
  validateEmailField();

  if (!isValidForm([email])) {
    return;
  }

  hasSent.value = true;
  currentCount.value = COUNT;
  saveCountdown();
  startCountdown();

  isLoading.value = true;
  const result = await authStore.forgotPassword(createPasswordResetRequest());
  isLoading.value = false;

  if (result.success) {
    toast.clear();
    toast.success(result.message);
  } else {
    toast.error(result.message);
  }
};

onMounted(() => {
  loadCountdown();
});

// Clean up on unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div
        class="bg-pg-secondary px-6 py-6 shadow sm:rounded-lg sm:px-12 border-2 border-white"
      >
        <form class="space-y-2" @submit.prevent="sendPasswordResetRequest">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              class="mx-auto h-20 w-auto"
              src="/src/assets/img/Pegasus.webp"
              alt="Pegasus Transport logo"
            />
            <h2
              class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
            >
              Reset Password
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a reset link
            </p>
          </div>

          <div>
            <TextInput
              name="email"
              :isValid="email.isValid"
              v-model="email.value"
              @blur="validateEmailField"
            >
            </TextInput>
            <p v-if="!email.isValid" class="mt-2 text-sm text-red-600">
              {{ email.errorMessage }}
            </p>
          </div>

          <div>
            <Button
              :disabled="isLoading || counting"
              type="submit"
              class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5 transition-opacity duration-300"
              :class="{
                'opacity-50 cursor-not-allowed pointer-events-none':
                  isLoading || counting,
              }"
            >
              {{ sendButtonText }}
            </Button>

            <div class="min-h-[24px]">
              <Transition
                enter-active-class="transition-all duration-500 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-in absolute inset-0"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-2"
              >
                <p v-if="counting" class="text-center text-sm text-gray-700">
                  You can resend the reset link in:
                  <span class="font-semibold">{{ currentCount }}s</span>
                </p>
              </Transition>
            </div>
          </div>
        </form>
      </div>

      <p class="mt-10 text-center text-sm/6 text-white">
        Remember your password?
        {{ " " }}
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold text-pg-secondary hover:text-pg-accent"
        >
          Back to Login
        </RouterLink>
      </p>
    </div>
  </div>
</template>
