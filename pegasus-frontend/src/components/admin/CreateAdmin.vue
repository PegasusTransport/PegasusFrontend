<script setup lang="ts">
import useFormValidation, {
  type DefaultField,
} from "@/hooks/useFormValidation";
import Button from "../reusables/Button.vue";
import TextInput from "../reusables/Forms/TextInput.vue";
import { computed, ref } from "vue";
import { adminApi } from "@/endpoints/admin";
import { useToast } from "vue-toastification";

const { createDefaultField, validateEmail } = useFormValidation();
const toast = useToast();
const email = ref<DefaultField>(createDefaultField());
const isLoading = ref(false);

const validateEmailField = () => validateEmail(email.value);

const clearForm = () => {
  email.value.value = "";
};

const createAdmin = async (email: string) => {
  isLoading.value = true;
  validateEmailField();

  try {
    await adminApi.createAdmin(email);
    toast.success("Admin created successfully");
    clearForm();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create an admin");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl p-4">
    <div class="px-0 sm:px-6">
      <div class="sm:flex sm:items-center mt-4">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-semibold text-gray-900">Add an admin</h1>
          <p class="mt-2 text-sm text-gray-700">
            If you want to add new admin, fill the email below. Before adding
            the email, the new admin needs to create a normal account first.
          </p>
        </div>
      </div>
      <form @submit.prevent="createAdmin(email.value)">
        <div class="mt-4">
          <TextInput
            name="'admin-email'"
            :is-valid="email.isValid"
            v-model="email.value"
            @blur="validateEmailField"
            >Email</TextInput
          >
          <p v-if="!email.isValid" class="mt-2 text-sm text-red-600">
            {{ email.errorMessage }}
          </p>
          <Button :disabled="isLoading" class="mt-5" @click="createAdmin(email.value)" type="button">
           {{isLoading ? "Creating" : "Create Admin"}}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
