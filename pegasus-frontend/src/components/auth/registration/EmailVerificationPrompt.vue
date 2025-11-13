<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import Button from "@/components/reusables/Button.vue";
import { userApi } from "@/endpoints/user";
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps<{
  firstName: string;
  email: string;
}>();

// Counter
const COUNT = 60;
const currentCount = ref<number>(0);
const isLoading = ref<boolean>(false);
const counting = computed(() => {
  return currentCount.value > 0;
});

let countdownInterval: ReturnType<typeof setInterval> | null = null;

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    currentCount.value--;

    if (currentCount.value <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
    }
  }, 1000);
};

const resendVerificationEmail = async () => {
  isLoading.value = true;

  const result = await userApi.resendVerificationEmail({ email: props.email });

  isLoading.value = false;

  if (result.data) {
    toast.clear();
    toast.success(result.message || "Verification email sent successfully!");

    currentCount.value = COUNT;
    startCountdown();
  } else {
    toast.error(result.message || "Failed to send verification email");
  }
};

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<template>
  <transition
    appear
    enter-active-class="transition-opacity duration-700 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div
          class="bg-pg-secondary px-3 py-3 shadow sm:rounded-lg sm:px-12 border-2 border-white"
        >
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              class="mx-auto h-20 w-auto"
              src="/src/assets/img/Pegasus.png"
              alt="Pegasus Transport logo"
            />
            <h2
              class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
            >
              Check your email
            </h2>
          </div>
          <div class="text-center space-y-4 mt-6">
            <!-- Icon -->
            <div
              class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100"
            >
              <svg
                class="h-6 w-6 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <!-- Message -->
            <div class="space-y-2">
              <p class="text-base text-gray-900">
                Hello, {{ firstName }}! We've sent a verification link to
              </p>
              <p v-if="email" class="text-sm font-semibold text-indigo-600">
                {{ email }}
              </p>
              <p class="text-sm text-gray-600">
                Click the link in the email to verify your account and complete
                registration.
              </p>
            </div>
            <!-- Actions -->
            <div class="mt-6 space-y-3">
              <Button
                link
                to="/login"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5"
              >
                Go to login
              </Button>
              <div class="min-h-[20px]">
                <p class="text-sm text-gray-600">
                  Didn't receive the email?
                  <button
                    @click="resendVerificationEmail"
                    :disabled="isLoading || counting"
                    type="button"
                    class="font-semibold text-indigo-600 hover:text-indigo-500 transition-all duration-200"
                    :class="{
                      'opacity-50 cursor-not-allowed pointer-events-none':
                        isLoading || counting,
                    }"
                  >
                    Resend
                  </button>
                </p>
                <Transition
                  enter-active-class="transition-all duration-500 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-300 ease-in absolute inset-0"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 translate-y-2"
                >
                  <p v-if="counting" class="text-xs text-gray-600 mt-1">
                    You can resend in:
                    <span class="font-semibold">{{ currentCount }}s</span>
                  </p>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
