<script setup lang="ts">
import { XMarkIcon } from "@heroicons/vue/24/solid";
import {
	TransitionChild,
	TransitionRoot,
	Dialog,
	DialogPanel,
} from "@headlessui/vue";

defineProps<{
	open: boolean;
	sm?: boolean;
	md?: boolean;
	lg?: boolean;
	xl?: boolean;
}>();

defineEmits<(e: "close") => void>();
</script>

<template>
	<TransitionRoot as="template" :show="open">
		<Dialog
			as="div"
			class="relative z-50"
			@close="$emit('close')"
		>
			<!-- Background overlay -->
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-neutral-700/75 transition-opacity" />
			</TransitionChild>

			<!-- Modal container -->
			<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6"
							:class="{
								'sm:max-w-sm': sm,
								'sm:max-w-md': md,
								'sm:max-w-lg': !sm && !md && !lg && !xl, // default
								'sm:max-w-4xl': lg,
								'sm:max-w-6xl': xl,
							}"
						>
							<!-- Close button -->
							<div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
								<button
									@click="$emit('close')"
									type="button"
									class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:cursor-pointer"
								>
									<span class="sr-only">Close</span>
									<XMarkIcon class="h-6 w-6" aria-hidden="true" />
								</button>
							</div>

							<!-- Modal content -->
							<div class="mt-5">
								<slot></slot>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>