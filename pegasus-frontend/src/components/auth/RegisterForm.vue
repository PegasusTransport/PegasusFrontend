<script setup lang="ts">
import { authApi } from "@/endpoints/auth";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import { computed, ref, watch } from "vue";
import Button from "../reusables/Button.vue";
import { useToast } from "vue-toastification";

interface RegisterFormData extends RegistrationRequestDto {
  confirmPassword: string;
}

const toast = useToast();

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

const errors = ref({
  userName: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
});

const validateUsername = (userName: string) => {
  if (!userName) return "Användarnamn är obligatorisk";
  if (userName.length < 3) return "Anändarnamn ska innehålla minst 3 tecken";
  if (!/^[a-zA-Z0-9_]+$/.test(userName))
    return "Användarnamn får inte innehålla symboler";
  return "";
};

const validateFirstName = (firstName: string) => {
  if (!firstName) return "Namnet är obligatorisk";
  return "";
};

const validateLastName = (lastName: string) => {
  if (!lastName) return "Efternamn är obligatorisk";
  return "";
};

const validateEmail = (email: string) => {
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
    return "Email adressen är inte korrekt";
  return "";
};

const validatePassword = (password: string) => {
  if (!password) return "Du måste ange ett lösenord";
  if (password.length < 6) return "Lösenordet ska innehålla minst 6 tecken";
  if (!/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/.test(password))
    return "Lösenordet ska innehålla minst 6 tecken, 1 versal och 1 symbol";
  return "";
};

const validateConfirmPassword = (confirmPassword: string, password: string) => {
  if (!confirmPassword) return "Du måste bekräfta lösenordet";
  if (confirmPassword != password) return "Lösenord ska vara likadana";
  return "";
};

const validatePhone = (phoneNumber: string) => {
  if (!phoneNumber) return "Ange ditt telefonnumer";
  if (!/^\+?\d{10,15}$/.test(phoneNumber))
    return "Ange en giltigt telfonnummer";
  return "";
};

watch(
  () => registerForm.value.userName,
  (newValue: string) => {
    errors.value.userName = validateUsername(newValue);
  }
);

watch(
  () => registerForm.value.firstName,
  (newValue: string) => {
    errors.value.firstName = validateFirstName(newValue);
  }
);

watch(
  () => registerForm.value.lastName,
  (newValue: string) => {
    errors.value.lastName = validateLastName(newValue);
  }
);

watch(
  () => registerForm.value.password,
  (newValue: string) => {
    errors.value.password = validatePassword(newValue);

    if (registerForm.value.confirmPassword) {
      errors.value.confirmPassword = validateConfirmPassword(
        registerForm.value.confirmPassword,
        newValue
      );
    }
  }
);

watch(
  () => registerForm.value.confirmPassword,
  (newValue: string) => {
    errors.value.confirmPassword = validateConfirmPassword(
      newValue,
      registerForm.value.password
    );
  }
);

watch(
  () => registerForm.value.email,
  (newValue: string) => {
    errors.value.email = validateEmail(newValue);
  }
);

watch(
  () => registerForm.value.phoneNumber,
  (newValue: string) => {
    errors.value.phoneNumber = validatePhone(newValue);
  }
);

const checkForm = computed(() => {
  return (
    !errors.value.userName &&
    !errors.value.firstName &&
    !errors.value.lastName &&
    !errors.value.email &&
    !errors.value.phoneNumber &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    registerForm.value.userName &&
    registerForm.value.firstName &&
    registerForm.value.lastName &&
    registerForm.value.email &&
    registerForm.value.phoneNumber &&
    registerForm.value.password &&
    registerForm.value.confirmPassword
  );
});

const isLoading = ref<boolean>(false);

const register = async () => {
  isLoading.value = true;

  try {
    await authApi.register(registerForm.value);

    toast.success("Ditt konto har skapats! Du kan nu logga in.", {
      timeout: 5000,
    });

    setTimeout(() => {
      registerForm.value = {
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: 0,
      };
    }, 1000);
  } catch (error: any) {
    console.error("Registration error:", error);
    console.error("Error response:", error.response);

    const errorMessage = error.response?.data?.message || "";
    const statusCode = error.response?.status;

    if (statusCode === 429) {
      toast.error("För många försök. Vänta lite och försök igen.", {
        timeout: 5000,
      });
    } else if (errorMessage === "User exist") {
      toast.error("Detta mejl används redan", {
        timeout: 5000,
      });
    } else if (errorMessage.includes("Failed to create user")) {
      toast.error("Detta användarnamn används redan", {
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
              alt="Pegasus Trasnport logo"
            />
            <h2
              class="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
            >
              Skapa konto hos Pegasus Transport
            </h2>
          </div>

          <div>
            <label
              for="userName"
              class="block text-sm/6 font-medium text-gray-900 mt-4"
              >Användarnamn</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.userName"
                type="text"
                autocomplete="username"
                required
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  errors.userName
                    ? 'outline-red-500 focus:outline-red-600'
                    : 'outline-gray-300 focus:outline-pg-persian',
                ]"
              />
              <p v-if="errors.userName" class="mt-2 text-sm text-red-600">
                {{ errors.userName }}
              </p>
            </div>
          </div>

          <div>
            <label
              for="firstName"
              class="block text-sm/6 font-medium text-gray-900"
              >Förnamn</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.firstName"
                type="text"
                autocomplete="given-name"
                required
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  errors.firstName
                    ? 'outline-red-500 focus:outline-red-600'
                    : 'outline-gray-300 focus:outline-pg-persian',
                ]"
              />
              <p v-if="errors.firstName" class="mt-2 text-sm text-red-600">
                {{ errors.firstName }}
              </p>
            </div>
          </div>

          <div>
            <label
              for="lastName"
              class="block text-sm/6 font-medium text-gray-900"
              >Efternamn</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.lastName"
                type="text"
                autocomplete="family-name"
                required
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  errors.lastName
                    ? 'outline-red-500 focus:outline-red-600'
                    : 'outline-gray-300 focus:outline-pg-persian',
                ]"
              />
              <p v-if="errors.lastName" class="mt-2 text-sm text-red-600">
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <div>
            <label
              for="phoneNumber"
              class="block text-sm/6 font-medium text-gray-900"
              >Telefonnummer</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.phoneNumber"
                type="tel"
                autocomplete="tel"
                required
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  errors.phoneNumber
                    ? 'outline-red-500 focus:outline-red-600'
                    : 'outline-gray-300 focus:outline-pg-persian',
                ]"
              />
              <p v-if="errors.phoneNumber" class="mt-2 text-sm text-red-600">
                {{ errors.phoneNumber }}
              </p>
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
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  errors.email
                    ? 'outline-red-500 focus:outline-red-600'
                    : 'outline-gray-300 focus:outline-pg-persian',
                ]"
              />
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                {{ errors.email }}
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
                v-model="registerForm.password"
                type="password"
                name="password"
                id="password"
                required
                autocomplete="new-password"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  errors.password
                    ? 'outline-red-500 focus:outline-red-600'
                    : 'outline-gray-300 focus:outline-pg-persian',
                ]"
              />
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm/6 font-medium text-gray-900"
              >Konfirmera Lösenord</label
            >
            <div class="mt-2">
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                required
                autocomplete="new-password"
                :class="[
                  'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
                  errors.confirmPassword
                    ? 'outline-red-500 focus:outline-red-600'
                    : 'outline-gray-300 focus:outline-pg-persian',
                ]"
              />
              <p
                v-if="errors.confirmPassword"
                class="mt-2 text-sm text-red-600"
              >
                {{ errors.confirmPassword }}
              </p>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              :disabled="!checkForm || isLoading"
              :class="[
                'flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 my-5',
                checkForm && !isLoading
                  ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
                  : 'bg-gray-400 cursor-not-allowed',
              ]"
            >
              {{ isLoading ? "Registrerar..." : "Registera" }}
            </Button>
          </div>
        </form>
      </div>

      <p class="mt-10 text-center text-sm/6 text-white">
        Har du redan ett konto?
        {{ " " }}
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold text-pg-secondary hover:text-pg-accent"
          >Logga in</RouterLink
        >
      </p>
    </div>
  </div>
</template>
