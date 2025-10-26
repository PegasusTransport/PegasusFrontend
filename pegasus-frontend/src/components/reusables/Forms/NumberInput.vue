<script setup lang="ts">
import { watch } from "vue";
import Button from "../Button.vue";
const props = defineProps<{
	editingField: boolean;
	maxValue?: number;
	minValue?: number;
	clearable?: boolean;
	step?: string;
}>();

const value = defineModel<number | null | undefined>({
	required: false,
	default: undefined,
});



watch(value, () => {
	if (props.maxValue && value.value && value.value > props.maxValue) {
		value.value = props.maxValue;
	}
	if (props.minValue && value.value && value.value < props.minValue) {
		value.value = props.minValue;
	}
	if (typeof value.value !== "number") {
		value.value = undefined;
	}
});
</script>

<template>
	<div>
		<div v-if="!editingField">
			<dd class="mt-1 text-sm">
				{{ value || "-" }}
			</dd>
		</div>
		<input
			class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm p-2"
			v-if="editingField"
			type="number"
			:min="minValue"
			:max="maxValue"
			:step="step ?? '1'"
			v-model="value"
		/>
		<Button
			v-if="clearable && editingField && value != undefined"
			@click="value = undefined"
		>
			Clear
		</Button>
	</div>
</template>
