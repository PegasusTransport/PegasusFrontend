<script setup lang="ts">
import { ref, watch } from "vue";
import type { AutoCompleteSuggestionDto } from "@/types/autocomplete";
import type { CoordinateDto } from "@/types/coordinate-dto";
import { autoComplete } from "@/endpoints/autoComplete";
import type { ApiResponse } from "@/types/api-response-dto";

const props = defineProps({
  modelValue: String,
  placeholder: String,
});

const emit = defineEmits(["update:modelValue", "place-selected", "coordinates-cleared"]);

const query = ref(props.modelValue || "");
const suggestions = ref<AutoCompleteSuggestionDto[]>([]);
const showDropdown = ref(false);
const loading = ref(false);
const isSelectingFromDropdown = ref(false);
const selectedIndex = ref(-1);
let sessionToken = crypto.randomUUID();
let lastSelectedAddress = "";

async function loadSuggestions() {
  if (!query.value || query.value.length < 3 || isSelectingFromDropdown.value) {
    suggestions.value = [];
    showDropdown.value = false;
    selectedIndex.value = -1;
    return;
  }

  loading.value = true;

  try {
    const response = await autoComplete.postSuggestions({
      input: query.value,
      sessionToken,
    });

    suggestions.value = response.data.suggestions;
    showDropdown.value = true;
    selectedIndex.value = -1;
  } catch (err) {
    console.error(err);
    suggestions.value = [];
    showDropdown.value = false;
    selectedIndex.value = -1;
  } finally {
    loading.value = false;
  }
}

async function selectSuggestion(suggestion: AutoCompleteSuggestionDto) {
  isSelectingFromDropdown.value = true;
  showDropdown.value = false;
  selectedIndex.value = -1;
  
  query.value = suggestion.description;
  lastSelectedAddress = suggestion.description;
  emit("update:modelValue", suggestion.description);

  try {
    const response: ApiResponse<CoordinateDto> = await autoComplete.getCoordinates({
      placeId: suggestion.placeId,
      sessionToken,
    });

    const coordinates = response.data;
    
    if (coordinates?.latitude && coordinates?.longitude) {
      emit("place-selected", {
        formatted_address: suggestion.description,
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      });
      
      sessionToken = crypto.randomUUID();
    } else {
      emit("coordinates-cleared");
    }
  } catch (error) {
    console.error('Error getting coordinates:', error);
    emit("coordinates-cleared");
  } finally {
    setTimeout(() => {
      isSelectingFromDropdown.value = false;
    }, 100);
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!showDropdown.value || !suggestions.value.length) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1);
      break;
    
    case 'ArrowUp':
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    
    case 'Enter':
      event.preventDefault();
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        const suggestion = suggestions.value[selectedIndex.value];
        if (suggestion) {
          selectSuggestion(suggestion);
        }
      }
      break;
    
    case 'Escape':
      showDropdown.value = false;
      selectedIndex.value = -1;
      break;
  }
}

watch(query, (newValue) => {
  emit("update:modelValue", newValue);
  
  // Clear coordinates if user modifies the selected address
  if (lastSelectedAddress && newValue !== lastSelectedAddress) {
    lastSelectedAddress = "";
    emit("coordinates-cleared");
  }
  
  loadSuggestions();
});

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue !== query.value) {
    query.value = newValue || "";
  }
});
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      :placeholder="placeholder || 'Enter address'"
      class="w-full p-2 border border-gray-300 rounded"
      @keydown="handleKeydown"
    />

    <div v-if="loading" class="absolute right-2 top-2 text-sm text-gray-400">
      Loading…
    </div>

    <ul
      v-show="showDropdown && suggestions.length"
      class="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 z-10 max-h-60 overflow-y-auto"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.placeId"
        :class="[
          'p-2 cursor-pointer border-b border-gray-100 last:border-b-0',
          index === selectedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
        ]"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion.description }}
      </li>
    </ul>
  </div>
</template>