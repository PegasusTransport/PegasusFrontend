<script setup lang="ts">
import { ref } from "vue";
import EmailVerificationPrompt from "./EmailVerificationPrompt.vue";
import { useRegistrationStore } from "@/stores/registrationStore";
import { useToast } from "vue-toastification";
import { type DefaultField } from "@/hooks/useFormValidation";
import useFormValidation from "@/hooks/useFormValidation";
import userScrollActions from "@/hooks/useScrollActions";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";

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
            <form class="space-y-1" @submit.prevent="register">
              <div class="sm:mx-auto sm:w-full sm:max-w-md">
                <img
                  class="mx-auto h-20 w-auto"
                  src="/src/assets/img/Pegasus.png"
                  alt="Pegasus Transport logo"
                />
                <h2
                  class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
                >
                  Create an account at Pegasus Transport
                </h2>
              </div>

              <div>
                <label
                  for="user-name"
                  class="block text-sm/6 font-medium text-gray-900 mt-4"
                  >Username</label
                >
                <div class="mt-2">
                  <input
                    v-model.trim="username.value"
                    @blur="validateUsernameField"
                    type="text"
                    name="user-name"
                    id="user-name"
                    required
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                      !username.isValid
                        ? 'outline-red-500 focus:outline-red-600'
                        : 'outline-gray-300 focus:outline-pg-persian',
                    ]"
                  />
                  <p v-if="!username.isValid" class="mt-2 text-sm text-red-600">
                    {{ username.errorMessage }}
                  </p>
                </div>
              </div>

              <div>
                <label
                  for="first-name"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Name</label
                >
                <div class="mt-2">
                  <input
                    v-model.trim="firstName.value"
                    @blur="validateFirstNameField"
                    type="text"
                    name="first-name"
                    id="first-name"
                    autocomplete="given-name"
                    required
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                      !firstName.isValid
                        ? 'outline-red-500 focus:outline-red-600'
                        : 'outline-gray-300 focus:outline-pg-persian',
                    ]"
                  />
                  <p
                    v-if="!firstName.isValid"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ firstName.errorMessage }}
                  </p>
                </div>
              </div>

              <div>
                <label
                  for="last-name"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Last Name</label
                >
                <div class="mt-2">
                  <input
                    v-model.trim="lastName.value"
                    @blur="validateLastNameField"
                    type="text"
                    name="last-name"
                    id="last-name"
                    autocomplete="family-name"
                    required
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                      !lastName.isValid
                        ? 'outline-red-500 focus:outline-red-600'
                        : 'outline-gray-300 focus:outline-pg-persian',
                    ]"
                  />
                  <p v-if="!lastName.isValid" class="mt-2 text-sm text-red-600">
                    {{ lastName.errorMessage }}
                  </p>
                </div>
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
                    type="tel"
                    name="phone-number"
                    id="phone-number"
                    autocomplete="tel"
                    required
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                      !phoneNumber.isValid
                        ? 'outline-red-500 focus:outline-red-600'
                        : 'outline-gray-300 focus:outline-pg-persian',
                    ]"
                  />
                  <p
                    v-if="!phoneNumber.isValid"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ phoneNumber.errorMessage }}
                  </p>
                </div>
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Email</label
                >
                <div class="mt-2">
                  <input
                    v-model.trim="email.value"
                    @blur="validateEmailField"
                    type="email"
                    name="email"
                    id="email"
                    autocomplete="email"
                    required
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                      !email.isValid
                        ? 'outline-red-500 focus:outline-red-600'
                        : 'outline-gray-300 focus:outline-pg-persian',
                    ]"
                  />
                  <p v-if="!email.isValid" class="mt-2 text-sm text-red-600">
                    {{ email.errorMessage }}
                  </p>
                </div>
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
                    required
                    autocomplete="new-password"
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                      !password.isValid
                        ? 'outline-red-500 focus:outline-red-600'
                        : 'outline-gray-300 focus:outline-pg-persian',
                    ]"
                  />
                  <p v-if="!password.isValid" class="mt-2 text-sm text-red-600">
                    {{ password.errorMessage }}
                  </p>
                </div>
              </div>

              <div>
                <label
                  for="confirm-password"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Confirm Password</label
                >
                <div class="mt-2">
                  <input
                    v-model.trim="confirmedPassword.value"
                    @blur="validateConfirmedPasswordField"
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    required
                    autocomplete="new-password"
                    :class="[
                      'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                      !confirmedPassword.isValid
                        ? 'outline-red-500 focus:outline-red-600'
                        : 'outline-gray-300 focus:outline-pg-persian',
                    ]"
                  />
                  <p
                    v-if="!confirmedPassword.isValid"
                    class="mt-2 text-sm text-red-600"
                  >
                    {{ confirmedPassword.errorMessage }}
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-5"
                >
                  Create account
                </button>
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
