import { defineStore } from "pinia";
import router from "@/router"; // Import the router instance directly
import { useUserStore } from "./userStore";
import { useToast } from "vue-toastification";
import api from "@/plugins/axios";
import { authApi } from "@/endpoints/auth";
import authCookies from "@/utils/auth/cookies";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import type { LoginRequestDto } from "@/types/login-request-dto";
import type { TwoFARequestDto } from "@/types/two-fa-request-dto";
import type { ApiResponse } from "@/types/api-response-dto";
import type { LoginResponseDto } from "@/types/login-response-dto";
import axios from "axios";

// Helpers
const ERROR_MESSAGES = {
  GENERIC: "Something went wrong. Try again later",
  NETWORK: "Network error or unexpected issue occurred",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_LOCKED: "Your account has been locked. Please contact support",
  INVALID_2FA: "Invalid verification code",
  RATE_LIMITED: "Too many attempts. Please try again later",
} as const;

const NON_AXIOS_ERROR = {
  success: false,
  message: ERROR_MESSAGES.NETWORK,
} as const;

const getUserProfile = async () => {
  await useUserStore().getUserProfile();
};

const clearUser = () => {
  useUserStore().clearUser();
};

// Store
export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isAuthenticated: false,
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
        console.error(error);
        return {
          success: false,
          message: ERROR_MESSAGES.GENERIC,
        };
      }
    },

    async getSessionLifetime(): Promise<number> {
      const { data } = await authApi.getSessionLifetime();
      return data.refreshTokenLifetime;
    },

    async initializeAuth() {
      if (authCookies.isUserAuthenticated()) {
        try {
          await authApi.refreshToken();
          const sessionLifetime = await this.getSessionLifetime();
          await getUserProfile();

          this.isAuthenticated = true;
          authCookies.setIsAuthenticatedCookie(sessionLifetime);
        } catch (error) {
          console.error(error);
          this.logout();
        }
      }
    },

    async login(
      credentials: LoginRequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { message } = await authApi.login(credentials);

        return { success: true, message };
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 401) {
            return {
              success: false,
              message: ERROR_MESSAGES.INVALID_CREDENTIALS,
            };
          } else if (status === 403) {
            return {
              success: false,
              message: ERROR_MESSAGES.ACCOUNT_LOCKED,
            };
          } else if (status === 429) {
            return {
              success: false,
              message: ERROR_MESSAGES.RATE_LIMITED,
            };
          }

          return {
            success: false,
            message: ERROR_MESSAGES.GENERIC,
          };
        }
        return NON_AXIOS_ERROR;
      }
    },

    async verifyTwoFA(
      twoFARequest: TwoFARequestDto
    ): Promise<{ success: boolean; message: string }> {
      try {
        const { message } = await authApi.verifyTwoFA(twoFARequest);
        const sessionLifetime = await this.getSessionLifetime();
        await getUserProfile();

        this.isAuthenticated = true;
        authCookies.setIsAuthenticatedCookie(sessionLifetime);

        return { success: true, message };
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;

          if (status === 400) {
            return { success: false, message: ERROR_MESSAGES.INVALID_2FA };
          } else if (status === 429) {
            return {
              success: false,
              message: ERROR_MESSAGES.RATE_LIMITED,
            };
          }

          return {
            success: false,
            message: ERROR_MESSAGES.GENERIC,
          };
        }

        return NON_AXIOS_ERROR;
      }
    },

    async logout() {
      try {
        await authApi.logout();
      } catch (error) {
        console.error(error);
      } finally {
        clearUser();
        this.isAuthenticated = false;
        localStorage.clear();
        authCookies.removeIsAuthenticatedCookie();
        router.push("/login");
      }
    },

    // Remove in prod
    async devLogin(LoginRequest: LoginRequestDto) {
      try {
        await api.authApi.post<ApiResponse<LoginResponseDto>>(
          "/api/Auth/DevLogin",
          LoginRequest
        );

        const sessionLifetime = await this.getSessionLifetime();

        this.isAuthenticated = true;
        authCookies.setIsAuthenticatedCookie(sessionLifetime);
        await getUserProfile();
      } catch (error) {
        console.error(error);
      }
    },
  },
});
