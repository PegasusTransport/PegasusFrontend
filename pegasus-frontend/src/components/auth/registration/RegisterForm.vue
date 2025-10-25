<script setup lang="ts">
import { ref } from "vue";
import EmailVerificationPrompt from "./EmailVerificationPrompt.vue";
import { useRegistrationStore } from "@/stores/registrationStore";
import { useToast } from "vue-toastification";
import { type DefaultField } from "@/hooks/useFormValidation";
import useFormValidation from "@/hooks/useFormValidation";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";

const store = useRegistrationStore();
const toast = useToast();

const {
  createDefaultField,
  validateField,
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateConfirmedPassword,
  isValidForm,
} = useFormValidation();

const username = ref<DefaultField>(createDefaultField());
const firstName = ref<DefaultField>(createDefaultField());
const lastName = ref<DefaultField>(createDefaultField());
const email = ref<DefaultField>(createDefaultField());
const phoneNumber = ref<DefaultField>(createDefaultField());
const password = ref<DefaultField>(createDefaultField());
const confirmedPassword = ref<DefaultField>(createDefaultField());

const validateUsernameField = () => validateField(username.value, "Username");
const validateFirstNameField = () =>
  validateField(firstName.value, "First name");
const validateLastNameField = () => validateField(lastName.value, "Last name");
const validateEmailField = () => validateEmail(email.value);
const validatePhoneNumberField = () => validatePhoneNumber(phoneNumber.value);
const validatePasswordField = () => validatePassword(password.value, true);
const validateConfirmedPasswordField = () =>
  validateConfirmedPassword(confirmedPassword.value, password.value);

const createRegistrationRequest = (): RegistrationRequestDto => {
  return {
    username: username.value.value,
    firstName: firstName.value.value,
    lastName: lastName.value.value,
    email: email.value.value,
    phoneNumber: phoneNumber.value.value,
    password: password.value.value,
    role: 0,
  };
};

const register = async () => {
  validateUsernameField();
  validateFirstNameField();
  validateLastNameField();
  validateEmailField();
  validatePhoneNumberField();
  validatePasswordField();
  validateConfirmedPasswordField();

  if (
    !isValidForm([
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmedPassword,
    ])
  )
    return;

  const response = await store.register(createRegistrationRequest());
  if (response.success) {
    store.hasRegistered = true;
    toast.success("Account created successfully!", {
      timeout: 5000,
    });
  } else {
    toast.error(response.message, {
      timeout: 10000,
    });
  }
};
</script>

<template>
  <div v-if="store.hasRegistered">
    <EmailVerificationPrompt
      :first-name="store.firstName"
      :email="store.email"
    />
  </div>
  <div v-else>
    <div
      class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          class="mx-auto h-10 w-auto"
          src="/src/assets/img/Pegasus.png"
          alt="Your Company"
        />
        <h2
          class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
        >
          Register
        </h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <form @submit.prevent="register" class="space-y-6">
            <div>
              <label
                for="user-name"
                class="block text-sm/6 font-medium text-gray-900"
                >Username</label
              >
              <div class="mt-2">
                <input
                  v-model.trim="username.value"
                  @blur="validateUsernameField"
                  type="text"
                  name="user-name"
                  id="user-name"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p v-if="!username.isValid" class="mt-1 text-sm text-red-600">
                {{ username.errorMessage }}
              </p>
            </div>

            <div>
              <label
                for="first-name"
                class="block text-sm/6 font-medium text-gray-900"
                >First name</label
              >
              <div class="mt-2">
                <input
                  v-model.trim="firstName.value"
                  @blur="validateFirstNameField"
                  type="text"
                  name="first-name"
                  id="first-name"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p v-if="!firstName.isValid" class="mt-1 text-sm text-red-600">
                {{ firstName.errorMessage }}
              </p>
            </div>

            <div>
              <label
                for="last-name"
                class="block text-sm/6 font-medium text-gray-900"
                >Last name</label
              >
              <div class="mt-2">
                <input
                  v-model.trim="lastName.value"
                  @blur="validateLastNameField"
                  type="text"
                  name="last-name"
                  id="last-name"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p v-if="!lastName.isValid" class="mt-1 text-sm text-red-600">
                {{ lastName.errorMessage }}
              </p>
            </div>

            <div>
              <label
                for="email"
                class="block text-sm/6 font-medium text-gray-900"
                >Email address</label
              >
              <div class="mt-2">
                <input
                  v-model.trim="email.value"
                  @blur="validateEmailField"
                  type="email"
                  name="email"
                  id="email"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p v-if="!email.isValid" class="mt-1 text-sm text-red-600">
                {{ email.errorMessage }}
              </p>
            </div>

            <div>
              <label
                for="phone-number"
                class="block text-sm/6 font-medium text-gray-900"
                >Phone number</label
              >
              <div class="mt-2">
                <input
                  v-model.trim="phoneNumber.value"
                  @blur="validatePhoneNumberField"
                  type="text"
                  name="phone-number"
                  id="phone-number"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p v-if="!phoneNumber.isValid" class="mt-1 text-sm text-red-600">
                {{ phoneNumber.errorMessage }}
              </p>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm/6 font-medium text-gray-900"
                >Password</label
              >
              <div class="mt-2">
                <input
                  v-model.trim="password.value"
                  @blur="validatePasswordField"
                  type="password"
                  name="password"
                  id="password"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p v-if="!password.isValid" class="mt-1 text-sm text-red-600">
                {{ password.errorMessage }}
              </p>
            </div>

            <div>
              <label
                for="confirm-password"
                class="block text-sm/6 font-medium text-gray-900"
                >Confirm password</label
              >
              <div class="mt-2">
                <input
                  v-model.trim="confirmedPassword.value"
                  @blur="validateConfirmedPasswordField"
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
              <p
                v-if="!confirmedPassword.isValid"
                class="mt-1 text-sm text-red-600"
              >
                {{ confirmedPassword.errorMessage }}
              </p>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
