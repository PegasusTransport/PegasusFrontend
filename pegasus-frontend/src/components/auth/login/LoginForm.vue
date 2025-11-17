<script setup lang="ts">
import { ref } from "vue";
import { type DefaultField } from "@/hooks/useFormValidation";
import type { LoginRequestDto } from "@/types/login-request-dto";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import useFormValidation from "@/hooks/useFormValidation";
import TwofaForm from "./TwofaForm.vue";
import TextInput from "@/components/reusables/Forms/TextInput.vue";
import Button from "@/components/reusables/Button.vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

const toast = useToast();
const authStore = useAuthStore();
const userStore = useUserStore();
const router = useRouter();

const { createDefaultField, validateEmail, validatePassword, isValidForm } =
  useFormValidation();

const isLoading = ref<boolean>(false);
const hasLoggedIn = ref<boolean>(false);

const email = ref<DefaultField>(createDefaultField());
const password = ref<DefaultField>(createDefaultField());

const validateEmailField = () => validateEmail(email.value);
const validatePasswordField = () => validatePassword(password.value, false);

const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const createLoginRequest = (): LoginRequestDto => {
  return {
    email: email.value.value,
    password: password.value.value,
  };
};

const login = async (isProd: boolean) => {
  validateEmailField();
  validatePasswordField();

  if (isValidForm([email, password]))
    if (isProd) {
      isLoading.value = true;
      const result = await authStore.login(createLoginRequest());
      isLoading.value = false;

      if (result.success) {
        toast.clear();
        hasLoggedIn.value = true;
      } else {
        toast.error(result.message);
      }
    } else {
      await authStore.devLogin(createLoginRequest());
      const defaultRoute = userStore.loadRouteBasedOnRole();
      router.push(defaultRoute);
    }
};
</script>

<template>
  <div>
    <TwofaForm v-if="hasLoggedIn" :email="email.value"></TwofaForm>

    <div
      v-else
      key="login-form"
      class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen"
    >
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div
          class="bg-pg-secondary px-6 py-6 shadow sm:rounded-lg sm:px-12 border-2 border-white"
        >
          <!-- Set to false when in development -->
          <form class="space-y-2" @submit.prevent="login(true)">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                class="mx-auto h-20 w-auto"
                src="/src/assets/img/Pegasus.webp"
                alt="Pegasus Transport logo"
              />
              <h2
                class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
              >
                Log in
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
                :type="showPassword ? 'text' : 'password'"
                :isValid="password.isValid"
                v-model="password.value"
                @blur="validatePasswordField"
                :showPasswordToggle="true"
              >
                Password
              </TextInput>

              <p v-if="!password.isValid" class="mt-2 text-sm text-red-600">
                {{ password.errorMessage }}
              </p>
            </div>

            <div>
              <Button
                :disabled="isLoading"
                type="submit"
                class="flex w-full justify-center px-3 py-1.5 text-sm/6 my-5"
                >Login</Button
              >
            </div>
          </form>
        </div>

        <p class="mt-10 text-center text-sm/6 text-white">
          <RouterLink
            :to="{ name: 'ForgotPassword' }"
            class="font-semibold text-pg-secondary hover:text-pg-accent"
            >Forgot your password?</RouterLink
          >
        </p>

        <p class="mt-10 text-center text-sm/6 text-white">
          Don't have an account?
          <RouterLink
            :to="{ name: 'Register' }"
            class="font-semibold text-pg-secondary hover:text-pg-accent"
            >Register here</RouterLink
          >
        </p>
        <p class="mt-5 text-center text-sm/6 text-white">
          Return to home page?
          <a
            href="https://pegasusmvc.onrender.com/"
            class="font-semibold text-pg-secondary hover:text-pg-accent"
            >Pegasus Transport</a
          >
        </p>
      </div>
    </div>
  </div>
</template>
