<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "vue-toastification";
import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";
import type { ChangePasswordDto } from "@/types/change-password";
import type { DefaultField } from "@/hooks/useFormValidation";
import useFormValidation from "@/hooks/useFormValidation";
import { userApi } from "@/endpoints/user";

const toast = useToast();

const {
  createDefaultField,
  validateField,
  validatePassword,
  validateConfirmedPassword,
  isValidForm,
} = useFormValidation();

const isLoading = ref<boolean>(false);

const currentPassword = ref<DefaultField>(createDefaultField());
const newPassword = ref<DefaultField>(createDefaultField());
const confirmPassword = ref<DefaultField>(createDefaultField());

const validateCurrentPasswordField = () =>
  validateField(currentPassword.value, "Current password");
const validateNewPasswordField = () =>
  validatePassword(newPassword.value, true);
const validateConfirmPasswordField = () =>
  validateConfirmedPassword(confirmPassword.value, newPassword.value);

const updatePasswordRequest = (): ChangePasswordDto => {
  return {
    currentPassword: currentPassword.value.value,
    newPassword: newPassword.value.value,
    confirmNewPassword: confirmPassword.value.value,
  };
};

const changePassword = async () => {
  // Validate all fields
  validateCurrentPasswordField();
  validateNewPasswordField();
  validateConfirmPasswordField();

  if (!isValidForm([currentPassword, newPassword, confirmPassword])) {
    return;
  }

  isLoading.value = true;

  try {
    const result = await userApi.changePassword(updatePasswordRequest());

    if (result.data) {
      toast.success("Password changed successfully!");

      currentPassword.value = createDefaultField();
      newPassword.value = createDefaultField();
      confirmPassword.value = createDefaultField();
    } else {
      toast.error("Failed to change password");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    toast.error("An unexpected error occurred. Please try again.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8"
  >
    <div>
      <h2 class="text-base/7 font-semibold text-gray-900">Change password</h2>
      <p class="mt-1 text-sm/6 text-gray-500">
        Update your password associated with your account.
      </p>
    </div>

    <form class="md:col-span-2" @submit.prevent="changePassword">
      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div class="col-span-full">
          <TextInput
            name="current-password"
            type="password"
            :is-valid="currentPassword.isValid"
            :editing-field="true"
            v-model="currentPassword.value"
            @blur="validateCurrentPasswordField"
            :show-password-toggle="true"
          >
            Current password
          </TextInput>
          <p v-if="!currentPassword.isValid" class="mt-2 text-sm text-red-600">
            {{ currentPassword.errorMessage }}
          </p>
        </div>

        <div class="col-span-full">
          <TextInput
            name="new-password"
            type="password"
            :is-valid="newPassword.isValid"
            :editing-field="true"
            v-model="newPassword.value"
            @blur="validateNewPasswordField"
            :show-password-toggle="true"
          >
            New password
          </TextInput>
          <p v-if="!newPassword.isValid" class="mt-2 text-sm text-red-600">
            {{ newPassword.errorMessage }}
          </p>
        </div>

        <div class="col-span-full">
          <TextInput
            name="confirm-password"
            type="password"
            :is-valid="confirmPassword.isValid"
            :editing-field="true"
            v-model="confirmPassword.value"
            @blur="validateConfirmPasswordField"
          >
            Confirm password
          </TextInput>
          <p v-if="!confirmPassword.isValid" class="mt-2 text-sm text-red-600">
            {{ confirmPassword.errorMessage }}
          </p>
        </div>
      </div>

      <div class="mt-8 flex">
        <Button type="submit" :disabled="isLoading">
          {{ isLoading ? "Saving..." : "Save" }}
        </Button>
      </div>
    </form>
  </div>
</template>
