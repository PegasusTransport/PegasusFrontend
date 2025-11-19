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

const chatStyles = computed(() => ({
  height: "calc(100vh - 200px)",
  minHeight: "400px",
  maxHeight: "600px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "#F9F0DF",

}));
const introMessage = {
  html: `
    <div style="
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      text-align: center;
    ">
      <h3>Welcome to Pegasus Transport AI Chat</h3>
      <p>How can I assist you? You can ask me about our prices for example.</p>
    </div>
  `,
  role: 'ai'
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
        as="template"
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
        <div class="absolute inset-0 overflow-hidden">
          <!-- Mobile: Full width with padding, Desktop: Slide from right -->
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-10"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-300"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-300"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel
                class="pointer-events-auto w-screen max-w-lg sm:max-w-md"
              >
                <div
                  class="relative flex h-full flex-col overflow-y-auto bg-white shadow-xl"
                >
                  <div class="bg-pg-primary px-4 py-6 sm:px-6">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div>
                          <DialogTitle
                            class="text-xl font-semibold text-white"
                          >
                            Pegasus AI Assistant
                          </DialogTitle>
                        </div>
                      </div>

                      <button
                        type="button"
                        class="relative rounded-md p-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
                        @click="closeChat"
                      >
                        <span class="sr-only">Close chat</span>
                        <XMarkIcon class="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <!-- Chat content -->
                  <div class="relative flex-1 p-4 sm:p-6">
                    <deep-chat :connect="chatConfig" :style="chatStyles" :introMessage = "introMessage" />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>


<style scoped>
:deep(.deep-chat-container) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

:deep(.deep-chat-container::-webkit-scrollbar) {
  width: 4px;
}

:deep(.deep-chat-container::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.deep-chat-container::-webkit-scrollbar-thumb) {
  background-color: #cbd5e1;
  border-radius: 2px;
}
</style>