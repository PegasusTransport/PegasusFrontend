<script setup lang="ts">
import { computed } from "vue";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/vue/24/outline";

interface Props {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  showMobilePageInfo?: boolean;
  maxVisiblePages?: number;
}

interface Emits {
  (e: "goToPage", page: number): void;
  (e: "nextPage"): void;
  (e: "previousPage"): void;
}

const props = withDefaults(defineProps<Props>(), {
  showMobilePageInfo: true,
  maxVisiblePages: 7,
});

const emit = defineEmits<Emits>();

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  const total = props.totalPages;
  const current = props.currentPage;
  const maxVisible = props.maxVisiblePages;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (current <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("goToPage", page);
  }
};

const nextPage = () => {
  if (props.hasNextPage) {
    emit("nextPage");
  }
};

const previousPage = () => {
  if (props.hasPreviousPage) {
    emit("previousPage");
  }
};
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 pt-6"
    aria-label="Pagination"
  >
    <div class="-mt-px flex w-0 flex-1">
      <button
        @click="previousPage"
        :disabled="!hasPreviousPage"
        :class="[
          'inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium transition-colors',
          hasPreviousPage
            ? 'text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer'
            : 'text-gray-300 cursor-not-allowed',
        ]"
        :aria-label="
          hasPreviousPage ? 'Go to previous page' : 'Previous page unavailable'
        "
      >
        <ArrowLongLeftIcon
          class="mr-3 size-5 text-gray-400"
          aria-hidden="true"
        />
        Previous
      </button>
    </div>

    <div class="hidden md:-mt-px md:flex">
      <template v-for="(page, index) in paginationPages" :key="index">
        <span
          v-if="page === '...'"
          class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
          aria-hidden="true"
        >
          ...
        </span>
        <button
          v-else
          @click="goToPage(page as number)"
          :class="[
            'inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium cursor-pointer transition-colors',
            currentPage === page
              ? 'border-pg-primary text-pg-primary'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
          ]"
          :aria-current="currentPage === page ? 'page' : undefined"
          :aria-label="`Go to page ${page}`"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <div v-if="showMobilePageInfo" class="md:hidden -mt-px flex">
      <span
        class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
        aria-live="polite"
      >
        Page {{ currentPage }} of {{ totalPages }}
      </span>
    </div>

    <div class="-mt-px flex w-0 flex-1 justify-end">
      <button
        @click="nextPage"
        :disabled="!hasNextPage"
        :class="[
          'inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium transition-colors',
          hasNextPage
            ? 'text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer'
            : 'text-gray-300 cursor-not-allowed',
        ]"
        :aria-label="hasNextPage ? 'Go to next page' : 'Next page unavailable'"
      >
        Next
        <ArrowLongRightIcon
          class="ml-3 size-5 text-gray-400"
          aria-hidden="true"
        />
      </button>
    </div>
  </nav>
</template>
