<script setup lang="ts">
import { authApi } from "@/endpoints/auth";
import { computed, ref, reactive } from "vue";
import Button from "../reusables/Button.vue";
import { useToast } from "vue-toastification";
import type { LoginRequestDto } from "@/types/login-request-dto";

const toast = useToast();

const formData = reactive({
  email: {
    value: "",
    isValid: true,
  },
  password: {
    value: "",
    isValid: true,
  },
});

const validateEmail = () => {
  const email = formData.email.value;
  formData.email.isValid = !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

const validatePassword = () => {
  formData.password.isValid = !formData.password.value;
};

const passwordValidityClass = computed(() => {
  return !formData.password.isValid
    ? "outline-red-500 focus:outline-red-600"
    : "outline-gray-300 focus:outline-pg-persian";
});

const emailValidityClass = computed(() => {
  return !formData.email.isValid
    ? "outline-red-500 focus:outline-red-600"
    : "outline-gray-300 focus:outline-pg-persian";
})

const checkForm = computed(() => {
  return Object.values(formData).some((field) => !field.isValid);
});

const isLoading = ref<boolean>(false);

const login = async () => {
  if (!checkForm) return
  isLoading.value = true;

  try {
    // await authApi.login(loginForm.value);

    toast.success("Inloggad!", {
      timeout: 5000,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    console.error("Error response:", error.response);

    const errorMessage = error.response?.data?.message || "";
    const statusCode = error.response?.status;

    if (statusCode === 429) {
      toast.error("För många försök. Vänta lite och försök igen.", {
        timeout: 5000,
      });
    } else {
      toast.error(
        errorMessage ||
          error.response?.data?.error ||
          "Någonting gick fel, prova igen",
        {
          timeout: 5000,
        }
      );
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 h-screen">
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
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Email address</label
            >
            <div class="mt-2">
              <input
                v-model="formData.email.value"
                ö
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                required
                @blur="validateEmail"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  emailValidityClass
                ]"
              />
              <p v-if="!formData.email.isValid" class="mt-2 text-sm text-red-600">
                Invalid email
              </p>
            </div>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900"
              >Lösenord</label
            >
            <div class="mt-2">
              <input
                v-model="formData.password.value"
                type="password"
                name="password"
                id="password"
                required
                @blur="validatePassword"
                autocomplete="current-password"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  passwordValidityClass,
                ]"
              />
              <p
                v-if="!formData.password.isValid"
                class="mt-2 text-sm text-red-600"
              >
                Password is required
              </p>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              :disabled="!checkForm || isLoading"
              :class="[
                'flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 my-6',
                checkForm && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
                  : 'bg-gray-400 cursor-not-allowed',
              ]"
            >
              {{ isLoading ? "Loggar in..." : "Logga in" }}
            </Button>
          </div>
        </form>
      </div>

      <p class="mt-10 text-center text-sm/6 text-white">
        Har du inget konto än?
        {{ " " }}
        <RouterLink
          :to="{ name: 'Register' }"
          class="font-semibold text-pg-secondary hover:text-pg-accent"
          >Registrera dig</RouterLink
        >
      </p>
    </div>
  </div>
</template>
