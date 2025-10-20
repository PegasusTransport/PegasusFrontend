<script setup lang="ts">
import { authApi } from "@/endpoints/auth";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import { ref } from "vue";

interface RegisterFormData extends RegistrationRequestDto {
  confirmPassword: string;
}

const registerForm = ref<RegisterFormData>({
  userName: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  role: 0,
});

const message = ref<string>("");

const register = async () => {
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    message.value = "Lösenord matchar inte!";
    return;
  }
  try {
    const response = await authApi.register(registerForm.value);
    console.log(response.data);
    console.log(response.message);
    message.value = `Anändare är registrerad. Namn: ${response.data.firstName}`;
  } catch (error: any) {
    message.value =
      error.response?.data?.message ||
      "Det gick inte att registrera en användare";
  }
};
</script>

<template>
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
        Registrera dig på Pegasus Transport
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
        <form @submit.prevent="register" class="space-y-6">
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Användarnamn</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.userName"
                type="text"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label for="text" class="block text-sm/6 font-medium text-gray-900"
              >Förnamn</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.firstName"
                type="text"
                autocomplete="name"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label for="text" class="block text-sm/6 font-medium text-gray-900"
              >Efternamn</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.lastName"
                type="text"
                autocomplete="family-name"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm/6 font-medium text-gray-900"
              >Telefonnummer</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.phoneNumber"
                type="tel"
                autocomplete="tel"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Email address</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.email"
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
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
                v-model="registerForm.password"
                type="password"
                name="password"
                id="password"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <label
              for="password"
              class="block text-sm/6 font-medium text-gray-900"
              >Konfirmera Lösenord</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                name="password"
                id="confipassword"
                required
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registera
            </button>
          </div>
        </form>
      </div>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Har du redan ett konto?
        {{ " " }}
        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
          >Logga in</a
        >
      </p>
    </div>
  </div>
</template>
