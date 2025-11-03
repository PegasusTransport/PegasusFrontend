<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import type { TwoFARequestDto } from "@/types/two-fa-request-dto";
import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";

const props = defineProps<{
  email: string;
}>();

const store = useAuthStore();
const router = useRouter();
const toast = useToast();

const isLoading = ref<boolean>(false);
const verificationCode = ref<string>("");

const verifyTwoFA = async () => {
  const twoFaRequest: TwoFARequestDto = {
    email: props.email,
    verificationCode: verificationCode.value,
  };

  isLoading.value = true;
  const result = await store.verifyTwoFA(twoFaRequest);
  isLoading.value = false;

  if (result.success) {
    router.push("/admin"); // Placeholder. Will push depending on role
    toast.success("log in successful");
  } else {
    toast.error(result.message);
  }
};
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
            <div class="space-y-2">
              <p class="text-base text-gray-900">
                We've sent an authentication code to
              </p>
              <p v-if="email" class="text-sm font-semibold text-indigo-600">
                {{ email }}
              </p>
              <p class="text-sm text-gray-600">
                Copy the code in your email and paste it here
              </p>
            </div>

            <div>
              <TextInput
                v-model="verificationCode"
                name="two-fa-code"
              ></TextInput>
              <p class="mt-2 text-sm text-red-600"></p>
            </div>

            <div class="mt-6 space-y-3">
              <Button
                @click="verifyTwoFA"
                :disabled="isLoading"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5"
              >
                Send
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
