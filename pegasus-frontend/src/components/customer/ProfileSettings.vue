<script setup lang="ts">
import TextInput from "../reusables/Forms/TextInput.vue";
import Button from "../reusables/Button.vue";
import CancelButton from "../reusables/CancelButton.vue";
import { useToast } from "vue-toastification";
import useFormValidation, {
  type DefaultField,
} from "@/hooks/useFormValidation";
import { onMounted, ref, watch } from "vue";
import type { UpdateUserRequestDto } from "@/types/update-user-request-dto";
import { userApi } from "@/endpoints/user";
import type { UserResponseDto } from "@/types/user-response-dto";
import ChangePassword from "../reusables/ChangePassword.vue";

const toast = useToast();
const isLoading = ref(false);
const userDetails = ref<UserResponseDto | null>(null);

const {
  createDefaultField,
  validateField,
  validateEmail,
  validatePhoneNumber,
  isValidForm,
} = useFormValidation();

const username = ref<DefaultField>(createDefaultField());
const firstName = ref<DefaultField>(createDefaultField());
const lastName = ref<DefaultField>(createDefaultField());
const email = ref<DefaultField>(createDefaultField());
const phoneNumber = ref<DefaultField>(createDefaultField());

const populateFormFields = (user: UserResponseDto) => {
  username.value = createDefaultField();
  username.value.value = user.userName || "";
  firstName.value = createDefaultField();
  firstName.value.value = user.firstName || "";
  lastName.value = createDefaultField();
  lastName.value.value = user.lastName || "";
  email.value = createDefaultField();
  email.value.value = user.email || "";
  phoneNumber.value = createDefaultField();
  phoneNumber.value.value = user.phoneNumber || "";
};

watch(
  userDetails,
  (newUserDetails) => {
    if (newUserDetails) {
      populateFormFields(newUserDetails);
    }
  },
  { immediate: true }
);

const validateUsernameField = () => validateField(username.value, "Username");
const validateFirstNameField = () =>
  validateField(firstName.value, "First name");
const validateLastNameField = () => validateField(lastName.value, "Last name");
const validatePhoneNumberField = () => validatePhoneNumber(phoneNumber.value);
const validateEmailField = () => validateEmail(email.value);

const updateUserRequest = (): UpdateUserRequestDto => {
  return {
    userName: username.value.value,
    firstName: firstName.value.value,
    lastName: lastName.value.value,
    phoneNumber: phoneNumber.value.value,
    email: email.value.value,
  };
};

const updateProfile = async () => {
  if (isLoading.value) return;

  validateUsernameField();
  validateEmailField();
  validateFirstNameField();
  validateLastNameField();
  validatePhoneNumberField();

  if (!isValidForm([username, firstName, lastName, email, phoneNumber])) return;
  isLoading.value = true;
  try {
    await userApi.updateProfile(updateUserRequest());
    toast.success("Profile updated successfully!");
  } catch (error: any) {
    toast.error("Failed to update profile. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

const getUser = async () => {
  try {
    const response = await userApi.getUserProfile();
    userDetails.value = response.data;
  } catch (err) {
    toast.error("Error fetching user details");
  }
};
onMounted(() => getUser());
</script>

<template>
  <div>
    <main>
      <h1 class="sr-only">Account Settings</h1>

      <div class="divide-y divide-gray-300 p-1">
        <div
          class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 bg-white rounded-2xl mb-3"
        >
          <div>
            <h2 class="text-3xl font-semibold text-gray-900">
              Personal Information
            </h2>
            <p class="mt-1 text-sm/6 text-gray-500">
              Use a permanent address where you can receive mail.
            </p>
          </div>

          <form @submit.prevent="updateProfile" class="md:col-span-2">
            <div
              class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6"
            >
              <div class="sm:col-span-3">
                <TextInput
                  name="first-name"
                  v-model="firstName.value"
                  :editing-field="true"
                  :is-valid="firstName.isValid"
                  @blur="validateFirstNameField"
                  >First Name
                </TextInput>
                <p v-if="!firstName.isValid" class="mt-2 text-sm text-red-600">
                  {{ firstName.errorMessage }}
                </p>
              </div>

              <div class="sm:col-span-3">
                <TextInput
                  name="last-name"
                  :editing-field="true"
                  :is-valid="lastName.isValid"
                  v-model="lastName.value"
                  @blur="validateLastNameField"
                  >Last Name</TextInput
                >
                <p v-if="!lastName.isValid" class="mt-2 text-sm text-red-600">
                  {{ lastName.errorMessage }}
                </p>
              </div>

              <div class="col-span-full">
                <TextInput
                  name="email"
                  :editing-field="true"
                  :type="'email'"
                  :is-valid="email.isValid"
                  v-model="email.value"
                  @blur="validateEmailField"
                  >Email address</TextInput
                >
                <p v-if="!email.isValid" class="mt-2 text-sm text-red-600">
                  {{ email.errorMessage }}
                </p>
              </div>

              <div class="col-span-full">
                <TextInput
                  name="username"
                  :editing-field="true"
                  :is-valid="username.isValid"
                  v-model="username.value"
                  @blur="validateUsernameField"
                  >Username</TextInput
                >
                <p v-if="!username.isValid" class="mt-2 text-sm text-red-600">
                  {{ username.errorMessage }}
                </p>
              </div>

              <div class="col-span-full">
                <TextInput
                  name="phone-number"
                  :editing-field="true"
                  :is-valid="phoneNumber.isValid"
                  :type="'tel'"
                  v-model="phoneNumber.value"
                  @blur="validatePhoneNumberField"
                  >Phone Number</TextInput
                >
                <p
                  v-if="!phoneNumber.isValid"
                  class="mt-2 text-sm text-red-600"
                >
                  {{ phoneNumber.errorMessage }}
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

        <ChangePassword
        class="bg-white rounded-2xl p-2 mb-3 "/>

        <div
          class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8 bg-white rounded-2xl"
        >
          <div>
            <h2 class="text-3xl font-semibold text-gray-900">
              Delete account
            </h2>
            <p class="mt-1 text-sm/6 text-gray-500">
              No longer want to use our service? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </p>
          </div>

          <form class="flex items-start md:col-span-2">
            <CancelButton type="submit"> Yes, delete my account </CancelButton>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
