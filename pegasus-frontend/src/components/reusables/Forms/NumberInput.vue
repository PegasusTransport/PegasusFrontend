<script setup lang="ts">
import { watch } from "vue";
import Button from "../Button.vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  editingField: boolean;
  name: string;
  maxValue?: number;
  minValue?: number;
  clearable?: boolean;
  step?: string;
  isValid?: boolean;
}>();

const value = defineModel<number | null | undefined>({
  required: false,
  default: undefined,
});

watch(value, () => {
  if (typeof value.value !== "number") {
    value.value = undefined;
  }
  if (props.maxValue && value.value && value.value > props.maxValue) {
    value.value = props.maxValue;
  }
  if (props.minValue && value.value && value.value < props.minValue) {
    value.value = props.minValue;
  }
});
</script>

<template>
  <div>
    <label
      :for="name"
      class="block mb-2 text-sm/6 font-medium text-gray-900 mt-4"
    >
      <slot></slot>
    </label>

    <div v-if="!editingField">
      <dd class="mt-1 text-sm">
        {{ value || "-" }}
      </dd>
    </div>

    <input
      :class="[
        'block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6',
        !isValid
          ? 'outline-red-500 focus:outline-red-600'
          : 'outline-gray-300 focus:outline-pg-persian',
      ]"
      v-if="editingField"
      :id="name"
      type="number"
      :min="minValue"
      :max="maxValue"
      :step="step ?? '1'"
      v-model="value"
      v-bind="$attrs"
    />
    <Button
      v-if="clearable && editingField && value != undefined"
      @click="value = undefined"
    >
      Clear
    </Button>
  </div>
</template>
