<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-50" @close="closeChat">
      <div
        class="fixed inset-0 bg-opacity-75 backdrop-blur-xs transition-opacity"
      ></div>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div
                  class="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl"
                >
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle
                        class="text-base font-semibold text-gray-900"
                      >
                        Chat With Pegasus Transport AI assisted Bot
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          @click="closeChat"
                        >
                          <span class="absolute -inset-2.5"></span>
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="size-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <DeepChat

                      :connect="chatConfig"
                      style="
                        height: 80vh;
                        border-radius: 8px;
                        border: 2px solid #1ea896;
                        background-color: #f9f0df;
                        --message-color-user: #032240;
                        --message-color-ai: #1ea896;
                        --text-color: #032240;
                        --input-color: #f9f0df;
                        --input-border-color: #1ea896;
                        --button-color: #e5723a;
                        --submit-button-color: #032240;
                      "
                      
                    />
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

<script setup lang="ts">
import api from "@/plugins/axios";
import {DeepChat} from 'deep-chat'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";

// Props and emits
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Computed for reactivity
const isOpen = computed(() => props.open);

const closeChat = () => {
  emit("close");
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
      <div
        class="fixed inset-0 bg-opacity-75 backdrop-blur-xs transition-opacity"
      ></div>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div
            class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16"
          >
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div
                  class="relative flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl"
                >
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle
                        class="text-base font-semibold text-gray-900"
                      >
                        Chat With Pegasus Transport AI assisted Bot
                      </DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="relative rounded-md text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          @click="closeChat"
                        >
                          <span class="absolute -inset-2.5"></span>
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="size-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <deep-chat

                      :connect="chatConfig"
                      style="
                        height: 80vh;
                        border-radius: 8px;
                        border: 2px solid #1ea896;
                        background-color: #f9f0df;
                        --message-color-user: #032240;
                        --message-color-ai: #1ea896;
                        --text-color: #032240;
                        --input-color: #f9f0df;
                        --input-border-color: #1ea896;
                        --button-color: #e5723a;
                        --submit-button-color: #032240;
                      "
                      
                    />
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

// Props and emits
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Computed for reactivity
const isOpen = computed(() => props.open);

const closeChat = () => {
  emit("close");
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
