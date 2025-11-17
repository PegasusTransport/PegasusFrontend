<script setup lang="ts">
import { ref } from "vue";
import { type DefaultField } from "@/hooks/useFormValidation";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, useRoute } from "vue-router";
import useFormValidation from "@/hooks/useFormValidation";
import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";
import type { ConfirmPasswordResetDto } from "@/types/confirm-password-reset-dto";

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const {
  createDefaultField,
  validatePassword,
  validateConfirmedPassword,
  isValidForm,
} = useFormValidation();

const isLoading = ref<boolean>(false);
const newPassword = ref<DefaultField>(createDefaultField());
const confirmPassword = ref<DefaultField>(createDefaultField());
const resetToken = ref<string>((route.query.token as string) || "");

const validateNewPasswordField = () =>
  validatePassword(newPassword.value, true);

const validateConfirmedPasswordField = () =>
  validateConfirmedPassword(confirmPassword.value, newPassword.value);

const createConfirmPasswordReset = (): ConfirmPasswordResetDto => {
  return {
    email: route.query.email?.toString() || "",
    token: resetToken.value,
    newPassword: newPassword.value.value,
  };
};

const resetPassword = async () => {
  validateNewPasswordField();
  validateConfirmedPasswordField();

  if (!isValidForm([newPassword, confirmPassword])) {
    return;
  }

  if (!resetToken.value) {
    toast.error("Invalid or missing reset token");
    return;
  }

  isLoading.value = true;
  const result = await authStore.resetPassword(createConfirmPasswordReset());
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
        <form class="space-y-2" @submit.prevent="resetPassword">
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
              Enter your new password below
            </p>
          </div>

          <div>
            <TextInput
              name="newPassword"
              type="password"
              :isValid="newPassword.isValid"
              v-model="newPassword.value"
              @blur="validateNewPasswordField"
            >
              New password
            </TextInput>
            <p v-if="!newPassword.isValid" class="mt-2 text-sm text-red-600">
              {{ newPassword.errorMessage }}
            </p>
          </div>

          <div>
            <TextInput
              name="confirmPassword"
              type="password"
              :isValid="confirmPassword.isValid"
              v-model="confirmPassword.value"
              @blur="validateConfirmedPasswordField"
            >
              Confirm password
            </TextInput>
            <p
              v-if="!confirmPassword.isValid"
              class="mt-2 text-sm text-red-600"
            >
              {{ confirmPassword.errorMessage }}
            </p>
          </div>

          <div>
            <Button
              :disabled="isLoading"
              type="submit"
              class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5"
            >
              Reset Password
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
