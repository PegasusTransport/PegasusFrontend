<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Props {
  duration?: number;
  storageKey?: string;
  autoStart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 120,
  storageKey: "countdown_timer",
  autoStart: false,
});

const emit = defineEmits<{
  finished: [];
  tick: [remainingTime: number];
}>();

const currentCount = ref<number>(0);
const counting = computed(() => currentCount.value > 0);

let countdownInterval: ReturnType<typeof setInterval> | null = null;

const saveCountdown = () => {
  if (currentCount.value > 0) {
    const expiryTime = Date.now() + currentCount.value * 1000;
    localStorage.setItem(props.storageKey, expiryTime.toString());
  } else {
    localStorage.removeItem(props.storageKey);
  }
};

const loadCountdown = () => {
  const savedExpiry = localStorage.getItem(props.storageKey);
  if (savedExpiry) {
    const expiryTime = parseInt(savedExpiry, 10);
    const remainingTime = Math.floor((expiryTime - Date.now()) / 1000);

    if (remainingTime > 0) {
      currentCount.value = remainingTime;
      startCountdown();
    } else {
      localStorage.removeItem(props.storageKey);
    }
  }
};

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    currentCount.value--;
    saveCountdown();
    emit('tick', currentCount.value);

    if (currentCount.value <= 0) {
      clearInterval(countdownInterval!);
      countdownInterval = null;
      localStorage.removeItem(props.storageKey);
      emit('finished');
    }
  }, 1000);
};

const start = (customDuration?: number) => {
  currentCount.value = customDuration || props.duration;
  saveCountdown();
  startCountdown();
};

const stop = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  currentCount.value = 0;
  localStorage.removeItem(props.storageKey);
};

// Expose methods for parent components
defineExpose({
  start,
  stop,
  counting,
  currentCount,
});

onMounted(() => {
  if (props.autoStart) {
    loadCountdown();
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<template>
  <slot :counting="counting" :currentCount="currentCount" :start="start" :stop="stop">
    <div v-if="counting" class="text-center text-sm text-gray-700">
      Time remaining: <span class="font-semibold">{{ currentCount }}s</span>
    </div>
  </slot>
</template>