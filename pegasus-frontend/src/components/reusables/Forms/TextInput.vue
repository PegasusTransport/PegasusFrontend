<script setup lang="ts">
import { computed, ref } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    editingField?: boolean;
    type?: string;
    name: string;
    placeholder?: string;
    isValid?: boolean;
    showPasswordToggle?: boolean; 
  }>(),
  {
    editingField: true,
    type: "text",
    isValid: true,
    showPasswordToggle: false,
  }
);

const value = defineModel<string | null>();
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});
</script>

<template>
  <div>
    <label
      :for="name"
      class="block mb-2 text-sm/6 font-medium text-gray-900"
    >
      <slot></slot>
    </label>
    <dd v-if="!editingField" class="mt-1 text-sm">
      {{ value || "-" }}
    </dd>

    <div v-if="editingField" class="relative">
      <input
        :id="name"
        :type="inputType"
        :placeholder="placeholder"
        v-model="value"
        v-bind="$attrs"
        :class="[
          'block w-full rounded-md bg-white px-3 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
          showPasswordToggle && type === 'password' ? 'py-1.5 pr-10' : 'py-1.5',
          !isValid
            ? 'outline-red-500 focus:outline-red-600'
            : 'outline-gray-300 focus:outline-pg-persian',
        ]"
      />
      
      <button
        v-if="showPasswordToggle && type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute cursor-pointer inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <EyeIcon v-if="!showPassword" class="h-5 w-5" />
        <EyeSlashIcon v-else class="h-5 w-5" />
      </button>
    </div>
  </div>
</template>