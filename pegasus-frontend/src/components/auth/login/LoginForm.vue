<script setup lang="ts">
import { ref } from "vue";
import { type DefaultField } from "@/hooks/useFormValidation";
import type { LoginRequestDto } from "@/types/login-request-dto";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/authStore";
import useFormValidation from "@/hooks/useFormValidation";
import userScrollActions from "@/hooks/useScrollActions";
import TwofaForm from "./TwofaForm.vue";
import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";

const toast = useToast();
const store = useAuthStore();

const { scrollToTop } = userScrollActions();

const { createDefaultField, validateEmail, validatePassword } =
  useFormValidation();

const isLoading = ref<boolean>(false);
const email = ref<DefaultField>(createDefaultField());
const password = ref<DefaultField>(createDefaultField());

const validateEmailField = () => validateEmail(email.value);
const validatePasswordField = () => validatePassword(password.value, false);

const createLoginRequest = (): LoginRequestDto => {
  return {
    email: email.value.value,
    password: password.value.value,
  };
};

const login = async () => {
  console.log("Clicked!");

  isLoading.value = true;
  const result = await store.login(createLoginRequest());
  isLoading.value = false;

  if (result.success) {
  } else {
    toast.error("Invalid email or password");
  }
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
    <div>
      <TwofaForm
        v-if="store.hasLoggedIn"
        email="Corte.Mauricio98@gmail.com"
      ></TwofaForm>

      <div
        v-else
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
                  @click="login"
                  :disabled="isLoading"
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
    </div>
  </transition>
</template>
