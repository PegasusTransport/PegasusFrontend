import { defineStore } from "pinia";
import { authApi } from "@/endpoints/auth";
import type { LoginRequestDto } from "@/types/login-request-dto";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      hasLoggedIn: false,
      email: "",
      isAuthenticated: false,
      role: [],
    };
  },
  actions: {
    // async login(
    //   credentials: LoginRequestDto
    // ): Promise<{ success: boolean; message: string }> {
    //   try {
    //     const { data, message } = await authApi.login(credentials);

    //     this.email = data.email;
    //     this.hasLoggedIn = true;

    //     return { success: true, message: message };
    //   } catch (error) {
    //     return {
    //       success: false,
    //       message:
    //         error instanceof Error ? error.message : "Something went wrong...",
    //     };
    //   }
    // },

    async login(
      credentials: LoginRequestDto
    ): Promise<{ success: boolean; message: string }> {
      this.email = credentials.email;

      await new Promise((resolve) => setTimeout(resolve, 5000));

      this.hasLoggedIn = true;

      return { success: true, message: "Hello from the auth store!" };
    },
  },
});
