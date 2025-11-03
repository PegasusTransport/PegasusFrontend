import { defineStore } from "pinia";
import { authApi } from "@/endpoints/auth";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import type { LoginRequestDto } from "@/types/login-request-dto";
import type { TwoFARequestDto } from "@/types/two-fa-request-dto";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isAuthenticated: false,
      sessionDuration: 0,
    };
  },
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

    async initializeAuth() {
      try {
        await authApi.verifyAuth();
        this.isAuthenticated = true;
      } catch (error) {
        console.error("Unauthorized");
      }
    },

    async login(
      credentials: LoginRequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { message } = await authApi.login(credentials);
        return { success: true, message: message };
      } catch (error) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }
    },

    async verifyTwoFA(
      twoFARequest: TwoFARequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { data, message } = await authApi.verifyTwoFA(twoFARequest);

        this.isAuthenticated = data.isAuthenticated;
        this.sessionDuration = data.accessTokenExpiresIn;

        return { success: true, message: message };
      } catch (error) {
        return {
          success: false,
          message:
            "Something went wrong. Make sure you're using the correct code",
        };
      }
    },
  },
});
