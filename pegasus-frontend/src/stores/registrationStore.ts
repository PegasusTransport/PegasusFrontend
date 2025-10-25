import { defineStore } from "pinia";
import { authApi } from "@/endpoints/auth";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";

export const useRegistrationStore = defineStore("registration", {
  state: () => {
    return {
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
    async register(
      registrationRequest: RegistrationRequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { data, message } = await authApi.register(registrationRequest);
        this.firstName = data.firstName;
        this.email = data.email;
        return { success: true, message };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Something went wrong...",
        };
      }
    },
  },
});
