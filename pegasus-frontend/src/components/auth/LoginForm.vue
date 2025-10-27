<script setup lang="ts">
import { ref } from "vue";

import { type DefaultField } from "@/hooks/useFormValidation";

import { useToast } from "vue-toastification";
import useFormValidation from "@/hooks/useFormValidation";

import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";

const toast = useToast();

const { createDefaultField, validateEmail, validatePassword } =
  useFormValidation();

const email = ref<DefaultField>(createDefaultField());
const password = ref<DefaultField>(createDefaultField());

const validateEmailField = () => validateEmail(email.value);
const validatePasswordField = () => validatePassword(password.value, false);

const login = async () => {
  console.log("Hello from the login function!");
};
</script>

<template>
  <transition
    appear
    mode="out-in"
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      key="login-form"
      class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen"
    >
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div
          class="bg-pg-secondary px-6 py-6 shadow sm:rounded-lg sm:px-12 border-2 border-white"
        >
          <form class="space-y-2" @submit.prevent="login">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                class="mx-auto h-20 w-auto"
                src="/src/assets/img/Pegasus.png"
                alt="Pegasus Transport logo"
              />
              <h2
                class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
              >
                Login
              </h2>
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
              <Button
                type="submit"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5"
                >Login</Button
              >
            </div>
          </form>
        </div>

        <p class="mt-10 text-center text-sm/6 text-white">
          Don't have an account?
          {{ " " }}
          <RouterLink
            :to="{ name: 'Register' }"
            class="font-semibold text-pg-secondary hover:text-pg-accent"
            >Register here</RouterLink
          >
        </p>
      </div>
    </div>
  </transition>
</template>
