<script setup lang="ts">
import { adminApi } from "@/endpoints/admin";
import type { AllDriversRequestDto } from "@/types/all-drivers-dto";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import Button from "../reusables/Button.vue";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";
import CancelButton from "../reusables/CancelButton.vue";
import Modal from "../reusables/Modal.vue";
import { DialogPanel, DialogTitle } from "@headlessui/vue";
import { ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import type { CreateRequestDriverDto } from "@/types/create-request-driver-dto";
import TextInput from "../reusables/Forms/TextInput.vue";
import useFormValidation, {
  type DefaultField,
} from "@/hooks/useFormValidation";

const toast = useToast();
const drivers = ref<AllDriversRequestDto[]>([]);
const loading = ref(false);
const openDeleteModal = ref(false);
const openCreateModal = ref(false);
const selectedDriverId = ref<string>();

const { createDefaultField, validateField, validateEmail, isValidForm } =
  useFormValidation();

const driverEmail = ref<DefaultField>(createDefaultField());
const driverPlateNumber = ref<DefaultField>(createDefaultField());
const driverProfilePicture = ref<DefaultField>(createDefaultField());

const validateEmailField = () => validateEmail(driverEmail.value);
const validatePlateNumberField = () =>
  validateField(driverPlateNumber.value, "Plate Number");
const validateProfilePictureField = () =>
  validateField(driverProfilePicture.value, "Profile Picture URL");

const resetForm = () => {
  driverEmail.value = createDefaultField();
  driverPlateNumber.value = createDefaultField();
  driverProfilePicture.value = createDefaultField();
};

const selectDriver = computed(() => {
  return drivers.value.find((d) => d.id === selectedDriverId.value);
});

const createDriver = async () => {
  if (loading.value) return;

  validateEmailField();
  validatePlateNumberField();
  validateProfilePictureField();

  if (!isValidForm([driverEmail, driverPlateNumber, driverProfilePicture])) {
    return;
  }

  try {
    loading.value = true;

    const driver: CreateRequestDriverDto = {
      email: driverEmail.value.value,
      profilePicture: driverProfilePicture.value.value,
      licensePlate: driverPlateNumber.value.value,
    };

    await adminApi.addDriver(driver);
    toast.success("Driver created successfully!");
    openCreateModal.value = false;
    resetForm();
    await getDrivers();
  } catch (error) {
    console.error(error);
    toast.error("Error creating a driver");
  } finally {
    loading.value = false;
  }
};

const getDrivers = async () => {
  try {
    loading.value = true;
    const response = await adminApi.getDrivers();
    drivers.value = response.data;
  } catch (error) {
    toast.error("Failed to fetch driver list");
  } finally {
    loading.value = false;
  }
};

const deleteDriver = async (id: string) => {
  loading.value = true;
  try {
    await adminApi.deleteDriver(id);
    getDrivers();
    toast.success("Driver deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("Error deleting driver");
  } finally {
    loading.value = false;
    openDeleteModal.value = false;
  }
};

onMounted(() => {
  getDrivers();
});
</script>

<template>
  <div class="bg-white p-4 m-3 rounded-2xl flex flex-col gap-4">
    <!-- Header section -->
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="p-3">
          <h1 class="text-3xl font-semibold text-gray-900">Drivers</h1>
          <div class="sm:flex-auto">
            <p class="mt-2 text-sm text-gray-700">
              A list of all the drivers including their name, email and car.
            </p>
          </div>
          <div class="mt-4 flex gap-4 items-center">
            <Button @click="openCreateModal = true">Add Driver</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="loading"><TaxiSpinner size="large" /></div>
    <div v-else>
      <div
        class="px-3 py-8 text-center text-sm text-gray-500"
        v-if="drivers.length === 0"
      >
        <p>You don't have any drivers</p>
      </div>
      <div v-else class="px-4 sm:px-6 lg:px-8">
        <!-- Mobile Cards -->
        <div class="block sm:hidden space-y-4">
          <div
            v-for="driver in drivers"
            :key="driver.id"
            class="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div class="flex items-center mb-3">
              <div class="size-12 shrink-0">
                <img
                  class="size-12 rounded-full"
                  :src="driver.profilePicture"
                  alt=""
                />
              </div>
              <div class="ml-3 flex-1">
                <div class="text-sm font-bold text-gray-900">
                  {{ driver.firstName }} {{ driver.lastName }}
                </div>
                <a
                  :href="`mailto:${driver.email}`"
                  class="text-xs text-gray-500 hover:text-pg-persian transition-colors mt-1 block"
                >
                  {{ driver.email }}
                </a>
              </div>
            </div>
            <div class="space-y-1 text-sm text-gray-600 mb-3">
              <div>
                <div>
                  <span class="font-medium">Phone:</span>
                  <a
                    :href="`tel:${driver.phone}`"
                    class="text-gray-900 hover:text-pg-persian transition-colors ml-1"
                  >
                    {{ driver.phone }}
                  </a>
                </div>
              </div>
              <div>
                <span class="font-medium">Car:</span>
                {{ driver.make }} {{ driver.model }}
              </div>
              <div>
                <span class="font-medium">Reg Nr:</span>
                {{ driver.regNr }}
              </div>
            </div>
            <CancelButton
              @click="
                () => {
                  selectedDriverId = driver.id;
                  openDeleteModal = true;
                }
              "
              size="sm"
              class="w-full"
            >
              Delete Driver
            </CancelButton>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden sm:block mt-2">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-1"
            >
              <div
                class="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg"
              >
                <table class="relative min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 pr-3 pl-4 text-left text-sm font-bold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        class="px-3 py-3.5 text-left text-sm font-bold text-gray-900"
                      >
                        Car
                      </th>
                      <th scope="col" class="py-3.5 pr-4 pl-3 sm:pr-6">
                        <span class="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-if="drivers.length === 0">
                      <td
                        colspan="4"
                        class="px-3 py-8 text-center text-sm text-gray-500"
                      >
                        You don't have any drivers
                      </td>
                    </tr>
                    <tr v-else v-for="driver in drivers" :key="driver.id">
                      <td
                        class="py-4 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6"
                      >
                        <div class="flex items-center">
                          <div class="size-11 shrink-0">
                            <img
                              class="size-11 rounded-full"
                              :src="driver.profilePicture"
                              alt=""
                            />
                          </div>
                          <div class="ml-4">
                            <div class="font-medium text-gray-900">
                              {{ driver.firstName }} {{ driver.lastName }}
                            </div>
                            <a
                              :href="`mailto:${driver.email}`"
                              class="mt-1 text-gray-500 hover:text-pg-persian transition-colors"
                            >
                              {{ driver.email }}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td
                        class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
                      >
                        <a
                          :href="`tel:${driver.phone}`"
                          class="text-gray-900 hover:text-pg-persian transition-colors"
                        >
                          {{ driver.phone }}
                        </a>
                      </td>
                      <td
                        class="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
                      >
                        <div class="text-gray-900 font-medium">
                          {{ driver.make }} {{ driver.model }}
                        </div>
                        <div class="text-gray-500">{{ driver.regNr }}</div>
                      </td>
                      <td
                        class="py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6"
                      >
                        <CancelButton
                          @click="
                            () => {
                              selectedDriverId = driver.id;
                              openDeleteModal = true;
                            }
                          "
                        >
                          Delete Driver
                        </CancelButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal
    :open="openCreateModal"
    @close="
      openCreateModal = false;
      resetForm();
    "
  >
    <DialogPanel>
      <DialogTitle as="h3" class="text-xl font-semibold text-gray-900 mb-4">
        Add a new driver
      </DialogTitle>

      <form @submit.prevent="createDriver()" class="space-y-4">
        <div>
          <TextInput
            name="email"
            v-model="driverEmail.value"
            :editing-field="true"
            :is-valid="driverEmail.isValid"
            placeholder="mail@example.com"
            :type="'email'"
            @blur="validateEmailField"
          >
            Email
          </TextInput>
          <p v-if="!driverEmail.isValid" class="mt-2 text-sm text-red-600">
            {{ driverEmail.errorMessage }}
          </p>
        </div>

        <div class="flex gap-6 items-start">
          <div class="flex-1">
            <TextInput
              name="profile-picture-url"
              v-model="driverProfilePicture.value"
              :editing-field="true"
              placeholder="example.com/image"
              :is-valid="driverProfilePicture.isValid"
              :type="'url'"
              @blur="validateProfilePictureField"
            >
              Profile Picture URL
            </TextInput>
            <p
              v-if="!driverProfilePicture.isValid"
              class="mt-2 text-sm text-red-600"
            >
              {{ driverProfilePicture.errorMessage }}
            </p>
          </div>
          <div
            v-if="driverProfilePicture.value"
            class="shrink-0 flex flex-col items-center"
          >
            <img
              :src="driverProfilePicture.value"
              alt="Profile preview"
              class="h-16 w-16 rounded-full object-cover border border-gray-300"
            />
          </div>
        </div>

        <div>
          <TextInput
            name="plate-number"
            v-model="driverPlateNumber.value"
            :editing-field="true"
            :is-valid="driverPlateNumber.isValid"
            placeholder="ABC123"
            :type="'text'"
            @blur="validatePlateNumberField"
          >
            Plate Number
          </TextInput>
          <p
            v-if="!driverPlateNumber.isValid"
            class="mt-2 text-sm text-red-600"
          >
            {{ driverPlateNumber.errorMessage }}
          </p>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <CancelButton
            type="button"
            @click="
              openCreateModal = false;
              resetForm();
            "
          >
            Cancel
          </CancelButton>
          <Button type="submit" :disabled="loading">
            {{ loading ? "Creating..." : "Create Driver" }}
          </Button>
        </div>
      </form>
    </DialogPanel>
  </Modal>
  <Modal :open="openDeleteModal" @close="openDeleteModal = false">
    <DialogPanel>
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
        >
          <ExclamationTriangleIcon
            class="size-6 text-red-600"
            aria-hidden="true"
          />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <DialogTitle as="h3" class="text-xl font-semibold text-gray-900"
            >Cancel booking</DialogTitle
          >
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete a driver? This action cannot be
              undone.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-5">
        <CancelButton
          @click="() => {deleteDriver(selectDriver?.id!); openDeleteModal = false; }"
        >
          Yes
        </CancelButton>
        <Button> No </Button>
      </div>
    </DialogPanel>
  </Modal>
</template>
