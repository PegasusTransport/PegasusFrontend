<script setup lang="ts">
import { ref } from "vue";
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

  isLoading.value = true;
  const result = await authStore.forgotPassword(createPasswordResetRequest());
  isLoading.value = false;

  if (result.success) {
    toast.clear();
    toast.success(result.message);
    router.push({ name: "Login" });
  } else {
    toast.error(result.message);
  }
};
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
              src="/src/assets/img/Pegasus.png"
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
              :disabled="isLoading"
              type="submit"
              class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5"
            >
              Send Reset Link
            </Button>
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
