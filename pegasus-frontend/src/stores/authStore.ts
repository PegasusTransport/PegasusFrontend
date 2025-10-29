import { defineStore } from "pinia";
import { authApi } from "@/endpoints/auth";
import type { LoginRequestDto } from "@/types/login-request-dto";
import type { TwoFARequestDto } from "@/types/two-fa-request-dto";
import { UserRoles } from "@/types/models";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      hasLoggedIn: false,
      email: "",
      isAuthenticated: false,
      roles: [] as UserRoles[],
      sessionDuration: 0,
    };
  },
  actions: {
    async login(
      credentials: LoginRequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { data, message } = await authApi.login(credentials);

        this.email = data.email;
        this.hasLoggedIn = true;

        return { success: true, message: message };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Something went wrong...",
        };
      }
    },

    // async login(
    //   credentials: LoginRequestDto
    // ): Promise<{ success: boolean; message: string }> {
    //   this.email = credentials.email;

    //   await new Promise((resolve) => setTimeout(resolve, 1500));

    //   return { success: true, message: "Hello from the auth store!" };
    // },

    async verifyTwoFA(
      twoFARequest: TwoFARequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { data, message } = await authApi.verifyTwoFA(twoFARequest);

        console.log(data, message);

        this.isAuthenticated = data.isAuthenticated;
        this.roles = data.roles;
        this.sessionDuration = data.accessTokenExpiresIn;

        return { success: true, message: message };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Something went wrong...",
        };
      }
      role: [],
    };
  }
});