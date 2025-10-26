<script setup lang="ts">
import Button from "@/components/reusables/Button.vue";

defineProps<{
  firstName: string;
  email: string;
}>();
</script>
<template>
  <transition
    appear
    enter-active-class="transition-all duration-700 ease-out"
    enter-from-class="opacity-0 translate-y-12"
    enter-to-class="opacity-100 translate-y-0"
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
              <p class="text-sm text-gray-600">
                Didn't receive the email?
                <button
                  type="button"
                  class="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>

        <p class="mt-10 text-center text-sm/6 text-white">
          Need help?
          {{ " " }}
          <a
            href="#"
            class="font-semibold text-pg-secondary hover:text-pg-accent"
            >Contact Support</a
          >
        </p>
      </div>
    </div>
  </transition>
</template>
