import { defineStore } from "pinia";
import { authApi } from "@/endpoints/auth";
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
    async initializeAuth() {
      try {
        await authApi.verifyAuth();
        this.isAuthenticated = true;
      } catch (error) {
        console.error("Something went wrong...");
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
          message:
            error instanceof Error ? error.message : "Something went wrong...",
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
            error instanceof Error ? error.message : "Something went wrong...",
        };
      }
    },
  },
});
