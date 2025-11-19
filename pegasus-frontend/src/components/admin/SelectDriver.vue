<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import { ChevronRightIcon, TruckIcon } from "@heroicons/vue/24/outline";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { adminApi } from "@/endpoints/admin";
import { useToast } from "vue-toastification";
import TaxiSpinner from "../reusables/TaxiSpinner.vue";
import Button from "../reusables/Button.vue";

interface AvailableDriverResponsDto {
  driverId: string;
  profilePicture: string;
  fullName: string;
  phoneNumber: string;
  carModel: string;
  registrationNumber: string;
}

interface Props {
  bookingId: number;
  isOpen: boolean;
}
const toast = useToast();
const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  driverAssigned: [driverId: string];
}>();

const drivers = ref<AvailableDriverResponsDto[]>([]);
const loading = ref(false);
const assigning = ref(false);
const query = ref("");
const selectedDriver = ref<AvailableDriverResponsDto | null>(null)


const filteredDrivers = computed(() =>
  query.value === ""
    ? drivers.value
    : drivers.value.filter((driver) => {
        return (
          driver.fullName.toLowerCase().includes(query.value.toLowerCase()) ||
          driver.carModel.toLowerCase().includes(query.value.toLowerCase()) ||
          driver.registrationNumber
            .toLowerCase()
            .includes(query.value.toLowerCase())
        );
      })
);

const displayedDriver = computed(() => {
  return selectedDriver.value ?? filteredDrivers.value[0] ?? null;
})

const getAvailableDrivers = async () => {
  if (!props.bookingId) return;

  try {
    loading.value = true;
    const response = await adminApi.findAvailableDriverForBooking(
      props.bookingId
    );
    drivers.value = response.data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch available drivers");
  } finally {
    loading.value = false;
  }
};

const assignDriver = async () => {
  if (assigning.value || !selectedDriver.value) return;

  try {
    assigning.value = true;

    await adminApi.assignDriverToBooking(
      props.bookingId,
      selectedDriver.value.driverId
    );
    toast.success("Driver assigned successfully!");
    emit("driverAssigned", selectedDriver.value.driverId);
    closeDialog();
  } catch (error) {
    console.error(error);
    toast.error("Error assigning driver");
  } finally {
    assigning.value = false;
  }
};

const onSelect = (driver: AvailableDriverResponsDto) => {
  selectedDriver.value = driver;
};

const closeDialog = () => {
  emit("close");
  query.value = "";
  selectedDriver.value = null;
};

const resetForm = () => {
  query.value = "";
  selectedDriver.value = null;
  drivers.value = [];
};

watch(drivers, (newDrivers) => {
  if (newDrivers.length > 0 && !selectedDriver.value) {
    selectedDriver.value = newDrivers[0] ?? null;
  }
});

watch(filteredDrivers, (newFiltered) => {
  if (newFiltered.length > 0) {
    if (!selectedDriver.value || !newFiltered.some(d => d.driverId === selectedDriver.value?.driverId)) {
      selectedDriver.value = newFiltered[0] ?? null;
    }
  } else {
    selectedDriver.value = null;
  }
});
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.bookingId) {
      getAvailableDrivers();
    } else if (!newVal) {
      resetForm();
    }
  }
);

onMounted(() => {
  if (props.isOpen && props.bookingId) {
    getAvailableDrivers();
  }
});
</script>

<template>
  <TransitionRoot :show="isOpen" as="template" @after-leave="resetForm" appear>
    <Dialog class="relative z-10 p-2" @close="closeDialog">
      <TransitionChild 
        as="template" 
        enter="ease-out duration-300" 
        enter-from="opacity-0" 
        enter-to="opacity-100" 
        leave="ease-in duration-200" 
        leave-from="opacity-100" 
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500/25 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild 
          as="template" 
          enter="ease-out duration-300" 
          enter-from="opacity-0 scale-95" 
          enter-to="opacity-100 scale-100" 
          leave="ease-in duration-200" 
          leave-from="opacity-100 scale-100" 
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="mt-20 mx-auto p-4 max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 transition-all">
            <Combobox @update:modelValue="onSelect">
              <div class="grid grid-cols-1">
                <ComboboxInput 
                  class="col-start-1 row-start-1 h-12 w-full pr-4 pl-11 text-base text-gray-900 border-0 focus:ring-0 placeholder:text-gray-400 sm:text-sm" 
                  placeholder="Search drivers by name, car model, or registration..." 
                  @change="query = $event.target.value" 
                />
                <MagnifyingGlassIcon class="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400" aria-hidden="true" />
              </div>

              <ComboboxOptions v-if="!loading && filteredDrivers.length > 0" class="flex flex-col sm:flex-row transform-gpu sm:divide-x divide-gray-100" as="div" static>
                <div class="max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4">
                  <h2 class="mt-2 mb-4 font-bold text-2xl text-gray-900">Available Drivers</h2>
                  <div class="-mx-2 text-sm text-gray-700">
                    <ComboboxOption 
                      v-for="driver in filteredDrivers" 
                      :key="driver.driverId" 
                      :value="driver" 
                      as="template" 
                      v-slot="{ active }"
                    >
                      <div :class="[
                        'group flex cursor-pointer items-center rounded-md p-3 select-none',
                        active && 'bg-gray-100 text-gray-900',
                        selectedDriver?.driverId === driver.driverId && 'bg-indigo-50 border-l-2 border-indigo-500'
                      ]">
                        <img 
                          :src="driver.profilePicture" 
                          :alt="driver.fullName" 
                          class="size-8 flex-none rounded-full bg-gray-100 ring-1 ring-gray-200" 
                        />
                        <div class="ml-3 flex-auto">
                          <div class="font-medium">{{ driver.fullName }}</div>
                          <div class="text-gray-500 text-xs">{{ driver.carModel }} • {{ driver.registrationNumber }}</div>
                        </div>
                        <ChevronRightIcon v-if="selectedDriver?.driverId === driver.driverId" class="ml-3 size-5 flex-none text-indigo-500" aria-hidden="true" />
                      </div>
                    </ComboboxOption>
                  </div>
                </div>

                <!-- Driver details - shows below on mobile, to the right on desktop -->
                <div v-if="displayedDriver" class="w-full sm:w-1/2 flex-none flex flex-col divide-y divide-gray-100 border-t sm:border-t-0 sm:border-l border-gray-100">
                  <div class="flex-none p-6 text-center">
                    <img 
                      :src="displayedDriver.profilePicture || '/default-avatar.png'" 
                      :alt="displayedDriver.fullName" 
                      class="mx-auto size-16 rounded-full bg-gray-100 ring-1 ring-gray-200" 
                    />
                    <h2 class="mt-3 font-semibold text-gray-900">
                      {{ displayedDriver.fullName }}
                    </h2>
                    <p class="text-sm text-gray-500">
                      {{ displayedDriver.carModel }}
                    </p>
                  </div>
                  <div class="flex flex-auto flex-col justify-between p-6">
                    <dl class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                      <dt class="col-end-1 font-semibold text-gray-900">Phone</dt>
                      <dd>{{ displayedDriver.phoneNumber }}</dd>
                      
                      <dt class="col-end-1 font-semibold text-gray-900">Car Model</dt>
                      <dd>{{ displayedDriver.carModel }}</dd>
                      
                      <dt class="col-end-1 font-semibold text-gray-900">Registration</dt>
                      <dd>{{ displayedDriver.registrationNumber }}</dd>
                    </dl>
                    <Button 
                    class="mt-4"
                      type="button" 
                      :disabled="assigning"
                      @click="assignDriver"
                    >
                      {{ assigning ? 'Assigning...' : 'Assign Driver' }}
                    </Button>
                  </div>
                </div>
              </ComboboxOptions>

              <!-- Loading state -->
              <div v-if="loading" class="px-6 py-14 text-center text-sm sm:px-14">
                <TaxiSpinner size="large"/>
              </div>

              <!-- No results -->
              <div v-if="!loading && query !== '' && filteredDrivers.length === 0" class="px-6 py-14 text-center text-sm sm:px-14">
                <TruckIcon class="mx-auto size-6 text-gray-400" aria-hidden="true" />
                <p class="mt-4 font-semibold text-gray-900">No drivers found</p>
                <p class="mt-2 text-gray-500">We couldn't find any drivers matching your search. Please try again.</p>
              </div>

              <!-- No available drivers -->
              <div v-if="!loading && drivers.length === 0 && query === ''" class="px-6 py-14 text-center text-sm sm:px-14">
                <TruckIcon class="mx-auto size-6 text-gray-400" aria-hidden="true" />
                <p class="mt-4 font-semibold text-gray-900">No available drivers</p>
                <p class="mt-2 text-gray-500">There are currently no drivers available for this booking.</p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>