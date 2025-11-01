import { defineStore } from "pinia";
import { authApi } from "@/endpoints/auth";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";

export const useRegistrationStore = defineStore("registration", {
  actions: {
    async register(
      registrationRequest: RegistrationRequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { message } = await authApi.register(registrationRequest);
        return { success: true, message };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          message: "Something went wrong. Try again later",
        };
      }
    },
  },
});
