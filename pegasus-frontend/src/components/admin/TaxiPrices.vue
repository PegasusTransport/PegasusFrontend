<script setup lang="ts">
import { adminApi } from "@/endpoints/admin";
import type { TaxiSettings } from "@/types/models";
import { onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import Modal from "../reusables/Modal.vue";
import Button from "../reusables/Button.vue";
import InputLabel from "../reusables/Forms/InputLabel.vue";
import NumberInput from "../reusables/Forms/NumberInput.vue";
import CancelButton from "../reusables/CancelButton.vue";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";

const taxiPrices = ref<TaxiSettings | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();
const opendEditPriceModal = ref(false);
const updating = ref(false);

const formData = ref({
  kmPrice: 0,
  minutePrice: 0,
  startPrice: 0,
  zonePrice: 0,
});

const getTaxiPrices = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await adminApi.getTaximeterPrice();
    taxiPrices.value = response.data;
  } catch (err) {
    error.value = "Failed to fetch taxi prices";
    toast.error("Failed to fetch taxi prices");
  } finally {
    loading.value = false;
  }
};

const updateTaxiPrices = async () => {
  try {
    updating.value = true;
    const response = await adminApi.editTaximeterPrice(formData.value);
    taxiPrices.value = response.data;

    opendEditPriceModal.value = false;

    toast.success("Taxi prices updated successfully!");
  } catch (err) {
    toast.error("Failed to update taxi prices");
  } finally {
    updating.value = false;
  }
};

const openEditModal = () => {
  if (taxiPrices.value) {
    formData.value = {
      kmPrice: taxiPrices.value.kmPrice || 0,
      minutePrice: taxiPrices.value.minutePrice || 0,
      startPrice: taxiPrices.value.startPrice || 0,
      zonePrice: taxiPrices.value.zonePrice || 0,
    };
  }
  opendEditPriceModal.value = true;
};

onMounted(async () => {
  await getTaxiPrices();
});
</script>

<template>
  <div class="p-4 border-2 rounded-xl bg-white">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-base font-semibold text-gray-900">
            Taximeter Prices
          </h1>
          <p class="mt-2 text-sm text-gray-700">
            Here can you see the actual taximeter prices and edit them
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            @click="openEditModal"
            type="button"
            class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Change Price
          </Button>
        </div>
      </div>

      <div v-if="loading"><TaxiSpinner size="large" /></div>

      <div v-else-if="error" class="text-red-600 text-center py-4">
        {{ error }}
      </div>

      <div v-else-if="taxiPrices" class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <div
              class="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg"
            >
              <table class="relative min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Kilometer Price
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Minute Price
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Start Price
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Zone Price
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td
                      class="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-800 sm:pl-6"
                    >
                      {{ taxiPrices.kmPrice }} kr/km
                    </td>
                    <td
                      class="px-3 py-4 text-sm whitespace-nowrap text-gray-800"
                    >
                      {{ taxiPrices.minutePrice }} kr/min
                    </td>
                    <td
                      class="px-3 py-4 text-sm whitespace-nowrap text-gray-800"
                    >
                      {{ taxiPrices.startPrice }} kr.
                    </td>
                    <td
                      class="px-3 py-4 text-sm whitespace-nowrap text-gray-800"
                    >
                      {{ taxiPrices.zonePrice }} kr.
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

  <Modal :open="opendEditPriceModal" @close="opendEditPriceModal = false">
    <form @submit.prevent="updateTaxiPrices">
      <h1 class="text-2xl mb-5">Edit taxi prices</h1>

      <div class="flex flex-col gap-4">
        <div>
          <NumberInput
            name="sek-km"
            v-model="formData.kmPrice"
            :editing-field="true"
            :min-value="1"
            :max-value="200"
            class="mt-2"
            :is-valid="true"
          >
            Sek per km:
          </NumberInput>
        </div>

        <div>
          <NumberInput
            name="sek-min"
            v-model="formData.minutePrice"
            :editing-field="true"
            :min-value="1"
            :max-value="50"
            class="mt-2"
            :is-valid="true"
          >
            SEK per min:
          </NumberInput>
        </div>

        <div>
          <NumberInput
            name="start-price"
            v-model="formData.startPrice"
            :editing-field="true"
            :min-value="1"
            :max-value="1000"
            class="mt-2"
            :is-valid="true"
          >
            Start Price:
          </NumberInput>
        </div>

        <div>
          <NumberInput
            name="zone-price"
            v-model="formData.zonePrice"
            :editing-field="true"
            :min-value="1"
            :max-value="2000"
            class="mt-2"
            :is-valid="true"
          >
            Zone Price:
          </NumberInput>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <CancelButton type="button" @click="opendEditPriceModal = false">
          Cancel
        </CancelButton>

        <Button
          type="submit"
          :disabled="updating"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ updating ? "Updating..." : "Update Prices" }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
