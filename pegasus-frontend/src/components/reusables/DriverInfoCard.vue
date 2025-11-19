<script setup lang="ts">
import { computed, ref } from 'vue';
import Modal from './Modal.vue';
import {  PhoneIcon } from '@heroicons/vue/24/outline';

interface Driver {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
  carMake?: string;
  carModel?: string;
  licensePlate?: string;
}

const props = defineProps<{
  open: boolean;
  driver: Driver | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit('close');
};

const carInfo = computed(() => {
  if (!props.driver) return '';
  const make = props.driver.carMake || '';
  const model = props.driver.carModel || '';
  const plate = props.driver.licensePlate || '';
  
  const car = [make, model].filter(Boolean).join(' ');
  return plate ? `${car} (${plate})` : car;
});
</script>

<template>  
  <Modal :open="props.open" @close="handleClose">
    <h2 class="text-3xl text-center">Your driver:</h2>
    <div v-if="props.driver" class="flex flex-1 flex-col p-8">
      <img 
        class="mx-auto size-32 shrink-0 rounded-full bg-gray-300 outline -outline-offset-1 outline-black/5" 
        :src="props.driver.profilePicture" 
        :alt="props.driver.name" 
      />
      <h3 class="mt-6 text-lg text-center font-medium text-gray-900">{{ props.driver.name }}</h3>
      <div class="mt-2 text-center">
        <p v-if="carInfo" class="text-sm text-gray-600">{{ carInfo }}</p>
        
      </div>
    </div>
    
    <div v-if="props.driver" class="-mt-px flex">
      <div class="flex w-full">
        <a 
          :href="`tel:${props.driver.phoneNumber}`" 
          class="relative inline-flex w-full items-center justify-center gap-x-3 rounded-b-lg border border-transparent py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50"
        >
          <PhoneIcon class="size-5 text-gray-400" aria-hidden="true" />
          Call Driver
        </a>
      </div>
    </div>
  </Modal>
</template>