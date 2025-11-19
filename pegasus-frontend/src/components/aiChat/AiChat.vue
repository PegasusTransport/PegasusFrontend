<script setup lang="ts">
import api from "@/plugins/axios";
import "deep-chat";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isOpen = computed(() => props.open);

const closeChat = () => {
  emit("close");
};

// Updated mobile-friendly chat container styles
const chatStyles = computed(() => ({
  height: "calc(100dvh - 150px)",
  minHeight: "300px",
  maxHeight: "85dvh",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#F9F0DF",
}));

// Intro message
const introMessage = {
  html: `
    <div style="
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      background: #fff8ed;
      border: 1px solid #f0d9b5;
      text-align: center;
    ">
      <h3 style="font-size: 18px; margin-bottom: 6px;">Welcome to Pegasus Transport AI Chat</h3>
      <p style="font-size: 14px;">How can I assist you today? Ask me about prices or availability.</p>
    </div>
  `,
  role: "ai",
};

const chatConfig = {
  handler: async (body: any, signals: any) => {
    try {
      const userMessage = body.messages[body.messages.length - 1]?.text;

      if (!userMessage) {
        signals.onResponse({ error: "No message provided" });
        return;
      }

      const response = await api.defaultApi.post(
        `/api/Chatbot/Chatbot?input=${encodeURIComponent(userMessage)}`
      );

      const apiResponse = response.data;

      if (apiResponse.data === true) {
        signals.onResponse({
          text: apiResponse.message,
        });
      } else {
        signals.onResponse({
          error: apiResponse.message || "Something went wrong",
        });
      }
    } catch (error: any) {
      console.error("Chat API Error:", error);

      if (error.response?.status === 401) {
        signals.onResponse({
          error: "Du behöver logga in för att använda chatten",
        });
      } else if (error.response?.status === 403) {
        signals.onResponse({
          error: "Du har inte behörighet att använda chatten",
        });
      } else {
        signals.onResponse({
          error: "Det gick inte att ansluta till chatten. Försök igen.",
        });
      }
    }
  },
};
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-50" @close="closeChat">
      <!-- Backdrop -->
      <TransitionChild
        as="div"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 flex justify-center items-start sm:items-center p-2">
          <TransitionChild
            as="div"
            enter="transform transition ease-in-out duration-300"
            enter-from="translate-y-full sm:translate-x-full"
            enter-to="translate-y-0 translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leave-from="translate-y-0 translate-x-0"
            leave-to="translate-y-full sm:translate-x-full"
          >
            <!-- CENTERED CHAT PANEL -->
            <DialogPanel
              class="pointer-events-auto w-full sm:max-w-md bg-white rounded-xl shadow-xl overflow-hidden pb-[env(safe-area-inset-bottom)]"
            >
              <!-- HEADER -->
              <div
                class="bg-pg-primary px-4 py-4 sm:px-6 rounded-t-xl shadow-md flex justify-between items-center"
              >
                <DialogTitle class="text-lg sm:text-xl font-semibold text-white">
                  Pegasus AI Assistant
                </DialogTitle>

                <button
                  type="button"
                  @click="closeChat"
                  class="rounded-md p-2 text-white/80 hover:text-white hover:bg-white/10 transition"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>

              <!-- CHAT AREA -->
              <div class="relative flex-1 p-3 sm:p-6 overflow-hidden">
                <div class="h-full flex flex-col">
                  <deep-chat
                    :connect="chatConfig"
                    :style="chatStyles"
                    :introMessage="introMessage"
                  />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped>
/* Scrollbar UI */
:deep(.deep-chat-container) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

:deep(.deep-chat-container::-webkit-scrollbar) {
  width: 4px;
}
:deep(.deep-chat-container::-webkit-scrollbar-thumb) {
  background: #cbd5e1;
  border-radius: 2px;
}

/*** Optional: Prettier message bubbles ***/
:deep(.deep-chat-message-ai) {
  background: #f7efdb !important;
  border-radius: 12px !important;
}

:deep(.deep-chat-message-user) {
  background: #dbe8ff !important;
  border-radius: 12px !important;
}
</style>
