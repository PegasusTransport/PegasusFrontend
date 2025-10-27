<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    editingField?: boolean;
    type?: string;
    name: string;
    placeholder?: string;
    isValid?: boolean;
  }>(),
  {
    editingField: true,
    type: "text",
  }
);

const value = defineModel<string | null>();
</script>

<template>
  <div>
    <label
      :for="name"
      class="block mb-2 text-sm/6 font-medium text-gray-900 mt-4"
    >
      <slot></slot>
    </label>
    <dd v-if="!editingField" class="mt-1 text-sm">
      {{ value || "-" }}
    </dd>

    <input
      v-if="editingField"
      :id="name"
      :type="type"
      :placeholder="placeholder"
      v-model="value"
      v-bind="$attrs"
      :class="[
        'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
        !isValid
          ? 'outline-red-500 focus:outline-red-600'
          : 'outline-gray-300 focus:outline-pg-persian',
      ]"
    />
  </div>
</template>
