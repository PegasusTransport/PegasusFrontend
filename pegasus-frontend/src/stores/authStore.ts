import { defineStore } from "pinia";
import router from "@/router"; // Import the router instance directly
import { useToast } from "vue-toastification";
import api from "@/plugins/axios";
import { authApi } from "@/endpoints/auth";
import authCookies from "@/utils/auth/cookies";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import type { LoginRequestDto } from "@/types/login-request-dto";
import type { TwoFARequestDto } from "@/types/two-fa-request-dto";
import type { ApiResponse } from "@/types/api-response-dto";
import type { LoginResponseDto } from "@/types/login-response-dto";

const toast = useToast();

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isAuthenticated: false,
      refreshTokenExpiration: 7, // Might be handled inside action.
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
      if (authCookies.isUserAuthenticated()) {
        this.isAuthenticated = true;
        authApi.refreshToken();
        authCookies.setIsAuthenticatedCookie(this.refreshTokenExpiration);
      } else {
        console.error("Unauthorized");
      }
    },

    async login(
      credentials: LoginRequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { message } = await authApi.login(credentials);
        toast.clear();
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
        // getCookiesExpirationTimes ---> gets the expiration time of cookies

        this.isAuthenticated = true;
        authCookies.setIsAuthenticatedCookie(this.refreshTokenExpiration); // Expires in 10 days

        return { success: true, message: message };
      } catch (error) {
        return {
          success: false,
          message:
            "Something went wrong. Make sure you're using the correct code",
        };
      }
    },

    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        console.log(
          error instanceof Error
            ? error.message
            : "Something went wrong while trying to log out"
        );
      } finally {
        this.isAuthenticated = false;
        authCookies.removeIsAuthenticatedCookie();
        router.push("/login");
      }
    },

    async devLogin(LoginRequest: LoginRequestDto) {
      try {
        const response = await api.authApi.post<ApiResponse<LoginResponseDto>>(
          "/api/Auth/DevLogin",
          LoginRequest
        );
        const result = response.data;

        // console.log(result.data);
        // console.log(result.message);

        this.isAuthenticated = true;
        authCookies.setIsAuthenticatedCookie(this.refreshTokenExpiration);
      } catch (error) {
        console.log(
          error instanceof Error
            ? error.message
            : "Something went wrong on dev log in"
        );
      }
    },
  },
});
