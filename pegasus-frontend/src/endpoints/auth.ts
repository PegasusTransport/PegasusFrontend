import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { AuthResponseDto } from "@/types/auth-response-dto";
import type { LoginRequestDto } from "@/types/login-request-dto";
import type { LoginResponseDto } from "@/types/login-response-dto";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import type { RegistrationResponseDto } from "@/types/registration-response-dto";
import type { RequestPasswordResetDto } from "@/types/request-password-reset-dto";
import type { SessionLifetimeDto } from "@/types/session-lifetime-dto";
import type { TwoFARequestDto } from "@/types/two-fa-request-dto";

export const authApi = {
  async verifyAuth() {
    await api.authApi.get("/api/Auth/VerifyAuth");
  },

  async register(
    data: RegistrationRequestDto
  ): Promise<ApiResponse<RegistrationResponseDto>> {
    const response = await api.authApi.post<
      ApiResponse<RegistrationResponseDto>
    >("/api/User/Registration", data);
    return response.data;
  },

  async login(
    LoginRequest: LoginRequestDto
  ): Promise<ApiResponse<LoginResponseDto>> {
    const response = await api.authApi.post<ApiResponse<LoginResponseDto>>(
      "/api/Auth/Login",
      LoginRequest
    );
    return response.data;
  },

  async verifyTwoFA(
    twoFARequest: TwoFARequestDto
  ): Promise<ApiResponse<AuthResponseDto>> {
    const response = await api.authApi.post<ApiResponse<AuthResponseDto>>(
      "/api/Auth/VerifyTwoFA",
      twoFARequest
    );
    return response.data;
  },

  async getSessionLifetime(): Promise<ApiResponse<SessionLifetimeDto>> {
    const response = await api.authApi.get("/api/Auth/SessionLifeTime");
    return response.data;
  },

  async logout(): Promise<ApiResponse<boolean>> {
    const response = await api.authApi.post("/api/Auth/Logout");
    return response.data;
  },

  async forgotPassword(
    passwordResetRequest: RequestPasswordResetDto
  ): Promise<ApiResponse<boolean>> {
    const response = await api.authApi.post(
      "/api/Auth/ForgotPassword",
      passwordResetRequest
    );
    return response.data;
  },

  async refreshToken(): Promise<ApiResponse<string>> {
    const response = await api.authApi.post("/api/Auth/RefreshToken");
    return response.data;
  },
};
