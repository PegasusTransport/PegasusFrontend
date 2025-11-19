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
import type { UpdateRequestDriverDto } from "@/types/update-request-driver-dto";
import { userApi } from "@/endpoints/user";
import { driverApi } from "@/endpoints/driver"; 
import type { UserResponseDto } from "@/types/user-response-dto";
import type { DriverResponseDto } from "@/types/driver-info";
import type { ChangePasswordDto } from "@/types/change-password";
import ChangePassword from "../reusables/ChangePassword.vue";

const toast = useToast();
const isLoading = ref(false);
const userDetails = ref<UserResponseDto | null>(null);
const driverDetails = ref<DriverResponseDto>();

const {
  createDefaultField,
  validateField,
  validateEmail,
  validatePhoneNumber,
  isValidForm,
} = useFormValidation();
const profilePictureUrl = ref<DefaultField>(createDefaultField());
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

const populateDriverFields = (driver: DriverResponseDto) => {
  profilePictureUrl.value = createDefaultField();
  profilePictureUrl.value.value = driver.profilePicture || "";
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

watch(
  driverDetails,
  (newDriverDetails) => {
    if (newDriverDetails) {
      populateDriverFields(newDriverDetails);
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
const validateProfilePictureField = () =>
  validateField(profilePictureUrl.value, "Profile Picture URL");

const updateUserRequest = (): UpdateUserRequestDto => {
  return {
    userName: username.value.value,
    firstName: firstName.value.value,
    lastName: lastName.value.value,
    phoneNumber: phoneNumber.value.value,
    email: email.value.value,
  };
};



const updateDriverRequest = (): UpdateRequestDriverDto | null => {
  if (!profilePictureUrl.value.value || !driverDetails.value?.carId)
    return null;

  return {
    profilePicture: profilePictureUrl.value.value,
    carId: driverDetails.value.carId,
  };
};



const updateProfile = async () => {
  if (isLoading.value) return;

  validateUsernameField();
  validateEmailField();
  validateFirstNameField();
  validateLastNameField();
  validatePhoneNumberField();
  validateProfilePictureField();

  if (
    !isValidForm([
      username,
      firstName,
      lastName,
      email,
      phoneNumber,
      profilePictureUrl,
    ])
  )
    return;

  isLoading.value = true;
  try {
    await userApi.updateProfile(updateUserRequest());

    if (profilePictureUrl.value.value && driverDetails.value?.driverId) {
      const driverUpdateData = updateDriverRequest();
      if (driverUpdateData) {
        await driverApi.updateDriverProfile(
          driverUpdateData,
          driverDetails.value.driverId
        );
      }
    }

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

const getDriverInfo = async () => {
  try {
    const response = await driverApi.getDriverInfo();
    driverDetails.value = response.data;
  } catch (err) {
    toast.error("Error fetching driver details");
  }
};

onMounted(async () => {
  await Promise.all([getUser(), getDriverInfo()]);
});
</script>

<template>
  <div>
    <main>

      <div class="divide-y divide-gray-300 p-3">
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
              <div class="col-span-full">
                <div class="flex gap-6 items-start">
                  <div class="flex-1">
                    <TextInput
                      name="profile-picture-url"
                      v-model="profilePictureUrl.value"
                      :editing-field="true"
                      :is-valid="profilePictureUrl.isValid"
                      :type="'url'"
                      @blur="validateProfilePictureField"
                    >
                      Profile Picture URL
                    </TextInput>
                    <p
                      v-if="!profilePictureUrl.isValid"
                      class="mt-2 text-sm text-red-600"
                    >
                      {{ profilePictureUrl.errorMessage }}
                    </p>
                  </div>
                  <div
                    v-if="profilePictureUrl.value"
                    class="shrink-0 flex flex-col items-center"
                  >
                    <img
                      :src="profilePictureUrl.value"
                      alt="Profile preview"
                      class="h-20 w-20 rounded-full object-cover border border-gray-300"
                    />
                  </div>
                </div>
              </div>

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

        <ChangePassword class="bg-white mb-3 rounded-2xl"/>

       
      </div>
    </main>
  </div>
</template>
