<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';

interface Props {
  length?: number;
  modelValue?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  modelValue: '',
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'complete': [value: string];
}>();

const values = ref<string[]>(new Array(props.length).fill(''));
const inputs = ref<HTMLInputElement[]>([]);
const hasEmittedComplete = ref(false);
const containerRef = ref<HTMLDivElement>();
const hiddenInput = ref<HTMLInputElement>();
const isMobile = ref(false);

onMounted(() => {
  isMobile.value = window.innerWidth < 768 || 'ontouchstart' in window;
  
  nextTick(() => {
    if (isMobile.value) {
      hiddenInput.value?.focus();
    } else {
      inputs.value[0]?.focus();
    }
  });
});

watch(() => props.modelValue, (newValue) => {
  const chars = newValue.split('').slice(0, props.length);
  values.value = [...chars, ...new Array(props.length - chars.length).fill('')];
  hasEmittedComplete.value = false;
}, { immediate: true });

const updateValue = () => {
  const code = values.value.join('');
  emit('update:modelValue', code);
  
  if (!values.value.includes('') && !hasEmittedComplete.value) {
    hasEmittedComplete.value = true;
    emit('complete', code);
  }
  
  if (values.value.includes('')) {
    hasEmittedComplete.value = false;
  }
};

const onPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const pasted = event.clipboardData?.getData('text') || '';
  const digits = pasted.replace(/\D/g, '').slice(0, props.length);
  
  for (let i = 0; i < props.length; i++) {
    values.value[i] = digits[i] || '';
  }
  
  updateValue();
};

const onMobileInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const input = target.value.replace(/\D/g, '').slice(0, props.length);
  
  for (let i = 0; i < props.length; i++) {
    values.value[i] = input[i] || '';
  }
  
  updateValue();
  
  if (input.length === props.length) {
    nextTick(() => {
      target.value = '';
    });
  }
};

const onInput = (index: number, value: string) => {
  const digit = value.replace(/\D/g, '').slice(0, 1);
  values.value[index] = digit;
  updateValue();
  
  if (digit && index < props.length - 1) {
    nextTick(() => {
      inputs.value[index + 1]?.focus();
    });
  }
};

const onKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (!values.value[index] && index > 0) {
      nextTick(() => {
        inputs.value[index - 1]?.focus();
      });
    }
  }
  
  if (event.key === 'Delete') {
    event.preventDefault();
    clearAll();
  }
  
  if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
    event.preventDefault();
    selectAll();
  }
  
  if ((event.ctrlKey || event.metaKey) && event.key === 'Backspace') {
    event.preventDefault();
    clearAll();
  }
  
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    inputs.value[index - 1]?.focus();
  }
  
  if (event.key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault();
    inputs.value[index + 1]?.focus();
  }
};

const onMobileKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Backspace' && values.value.every(v => v === '')) {
    const target = event.target as HTMLInputElement;
    target.value = '';
  }
};

const clearAll = () => {
  values.value.fill('');
  hasEmittedComplete.value = false;
  updateValue();
  
  if (isMobile.value) {
    const target = hiddenInput.value;
    if (target) target.value = '';
    hiddenInput.value?.focus();
  } else {
    nextTick(() => {
      inputs.value[0]?.focus();
    });
  }
};

const selectAll = () => {
  if (isMobile.value) {
    hiddenInput.value?.focus();
  } else {
    nextTick(() => {
      inputs.value[0]?.focus();
    });
  }
};

const onContainerClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).tagName === 'INPUT') return;
  
  if (isMobile.value) {
    hiddenInput.value?.focus();
  } else {
    const firstEmptyIndex = values.value.findIndex(v => v === '');
    const targetIndex = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
    inputs.value[targetIndex]?.focus();
  }
};

defineExpose({ clearAll });
</script>

<template>
  <div 
    ref="containerRef"
    @paste="onPaste" 
    @click="onContainerClick"
    class="relative outline-none cursor-text p-2 rounded-lg"
    tabindex="0"
  >
    <input
      v-if="isMobile"
      ref="hiddenInput"
      type="tel"
      inputmode="numeric"
      :maxlength="length * 2"
      :disabled="disabled"
      class="absolute inset-0 w-full h-full opacity-0 z-10 pointer-events-auto caret-transparent"
      style="caret-color: transparent;"
      @input="onMobileInput"
      @keydown="onMobileKeydown"
      @paste="onPaste"
    />
    
    <div class="flex gap-1 sm:gap-2 justify-center">
      <div
        v-for="(value, index) in values"
        :key="index"
        class="flex items-center justify-center text-base sm:text-lg font-semibold border-2 border-gray-300 rounded-md transition-all duration-200"
        :class="[
          'w-10 h-10 sm:w-12 sm:h-12',
          {
            'bg-gray-100': disabled,
            'focus-within:border-pg-persian focus-within:ring-2 focus-within:ring-pg-persian focus-within:opacity-80': !disabled,
            'border-pg-persian-500 ring-2 ring-pg-persian': !disabled && isMobile && index === values.findIndex(v => v === ''),
            'active:scale-95': isMobile && !disabled
          }
        ]"
      >
        <input
          v-if="!isMobile"
          :ref="(el) => inputs[index] = el as HTMLInputElement"
          v-model="values[index]"
          :disabled="disabled"
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="w-full h-full text-center bg-transparent border-0 outline-none"
          @input="onInput(index, ($event.target as HTMLInputElement).value)"
          @keydown="onKeydown(index, $event)"
        />
        
        <span v-else class="select-none pointer-events-none">{{ value }}</span>
      </div>
    </div>
  </div>
</template>