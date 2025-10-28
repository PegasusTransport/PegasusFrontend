import { defineStore } from "pinia";
import { authApi } from "@/endpoints/auth";
import { useToast } from "vue-toastification";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";

const toast = useToast();

export const useRegistrationStore = defineStore("registration", {
  state: () => {
    return {
      hasRegistered: false,
      firstName: "",
      email: "",
    };
  },
  getters: {
    getUserInfo: (state) => {
      return state.firstName + " " + state.email;
    },
  },
  actions: {
    // async register(
    //   registrationRequest: RegistrationRequestDto
    // ): Promise<{ success: boolean; message: string }> {
    //   try {
    //     const { data, message } = await authApi.register(registrationRequest);

    //     this.firstName = data.firstName;
    //     this.email = data.email;

    //     return { success: true, message };
    //   } catch (error) {
    //     console.log(error);
    //     return {
    //       success: false,
    //       message:
    //         error instanceof Error ? error.message : "Something went wrong...",
    //     };
    //   }
    // },

    async register(
      registrationRequest: RegistrationRequestDto
    ): Promise<{ success: boolean; message: string }> {
      this.firstName = "Mauricio";
      this.email = "Corte.Mauricio98@gmail.com";

      await new Promise((resolve) => setTimeout(resolve, 1500));

      return { success: true, message: "Hello from the registration store!" };
    },
  },
});
