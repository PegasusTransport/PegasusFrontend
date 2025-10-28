<script setup lang="ts">
import { ref } from "vue";

import { type DefaultField } from "@/hooks/useFormValidation";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";

import { useRegistrationStore } from "@/stores/registrationStore";
import { useToast } from "vue-toastification";
import useFormValidation from "@/hooks/useFormValidation";
import userScrollActions from "@/hooks/useScrollActions";

import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";
import EmailVerificationPrompt from "./EmailVerificationPrompt.vue";

const store = useRegistrationStore();
const toast = useToast();

const { scrollToTop } = userScrollActions();

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
    scrollToTop([
      () => toast.success("Account created successfully!", { timeout: 5000 }),
      () => (store.hasRegistered = true),
    ]);
  } else {
    toast.error(response.message, { timeout: 10000 });
  }
};
</script>

<template>
  <Transition
    appear
    mode="out-in"
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="store.hasRegistered" key="verification">
      <EmailVerificationPrompt
        :first-name="store.firstName"
        :email="store.email"
      />
    </div>
    <div v-else key="registration">
      <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div
            class="bg-pg-secondary px-3 py-3 shadow sm:rounded-lg sm:px-12 border-2 border-white"
          >
            <form class="space-y-4" @submit.prevent="register">
              <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                  class="mx-auto h-20 w-auto"
                  src="/src/assets/img/Pegasus.png"
                  alt="Pegasus Transport logo"
                />
                <h2
                  class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900 mb-4"
                >
                  Register
                </h2>
              </div>

              <div>
                <TextInput
                  name="first-name"
                  :isValid="firstName.isValid"
                  v-model="firstName.value"
                  @blur="validateFirstNameField"
                >
                  First name
                </TextInput>
                <p v-if="!firstName.isValid" class="mt-2 text-sm text-red-600">
                  {{ firstName.errorMessage }}
                </p>
              </div>

              <div>
                <TextInput
                  name="last-name"
                  :isValid="lastName.isValid"
                  v-model="lastName.value"
                  @blur="validateLastNameField"
                >
                  Last name
                </TextInput>
                <p v-if="!lastName.isValid" class="mt-2 text-sm text-red-600">
                  {{ lastName.errorMessage }}
                </p>
              </div>

              <div>
                <TextInput
                  name="Username"
                  :isValid="username.isValid"
                  v-model="username.value"
                  @blur="validateUsernameField"
                >
                  Username
                </TextInput>
                <p v-if="!username.isValid" class="mt-2 text-sm text-red-600">
                  {{ username.errorMessage }}
                </p>
              </div>

              <div>
                <TextInput
                  name="email"
                  :isValid="email.isValid"
                  v-model="email.value"
                  @blur="validateEmailField"
                >
                  Email
                </TextInput>
                <p v-if="!email.isValid" class="mt-2 text-sm text-red-600">
                  {{ email.errorMessage }}
                </p>
              </div>

              <div>
                <TextInput
                  name="phone-number"
                  :isValid="phoneNumber.isValid"
                  v-model="phoneNumber.value"
                  @blur="validatePhoneNumberField"
                >
                  Phone number
                </TextInput>
                <p
                  v-if="!phoneNumber.isValid"
                  class="mt-2 text-sm text-red-600"
                >
                  {{ phoneNumber.errorMessage }}
                </p>
              </div>

              <div>
                <TextInput
                  name="password"
                  type="password"
                  :isValid="password.isValid"
                  v-model="password.value"
                  @blur="validatePasswordField"
                >
                  Password
                </TextInput>
                <p v-if="!password.isValid" class="mt-2 text-sm text-red-600">
                  {{ password.errorMessage }}
                </p>
              </div>

              <div>
                <TextInput
                  name="confirmed-password"
                  type="password"
                  :isValid="confirmedPassword.isValid"
                  v-model="confirmedPassword.value"
                  @blur="validateConfirmedPasswordField"
                >
                  Confirm password
                </TextInput>
                <p
                  v-if="!confirmedPassword.isValid"
                  class="mt-2 text-sm text-red-600"
                >
                  {{ confirmedPassword.errorMessage }}
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5"
                >
                  Create account
                </Button>
              </div>
            </form>
          </div>

          <p class="mt-10 text-center text-sm/6 text-white">
            Do you already have an account?
            {{ " " }}
            <RouterLink
              :to="{ name: 'Login' }"
              class="font-semibold text-pg-secondary hover:text-pg-accent"
              >Login</RouterLink
            >
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>
