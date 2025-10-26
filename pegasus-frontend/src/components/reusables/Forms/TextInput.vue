<script setup lang="ts">
import type { InputTypeHTMLAttribute } from "vue";
import InputLabel from "./InputLabel.vue";
defineProps<{
	editingField: boolean;
	inputType?: InputTypeHTMLAttribute;
	placeholder?: string
}>();

const value = defineModel<string | null>();
</script>

<template>
	<div>
		<InputLabel>
			<slot></slot>
		</InputLabel>

		<dd v-if="!editingField" class="mt-1 text-sm">
			{{ value || "-" }}
		</dd>

		<input
			class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:border-neutral-600 dark:bg-neutral-700 sm:text-sm"
			v-if="editingField"
			:type="inputType ?? 'text'"
			:placeholder="placeholder"
			v-model="value"
		/>
	</div>
</template>

<style scoped>
input:invalid {
	border-color: red;
}
</style>
