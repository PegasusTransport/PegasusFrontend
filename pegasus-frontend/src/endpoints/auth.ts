import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { AuthResponseDto } from "@/types/auth-response-dto";
import type { LoginRequestDto } from "@/types/login-request-dto";
import type { LoginResponseDto } from "@/types/login-response-dto";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import type { RegistrationResponseDto } from "@/types/registration-response-dto";
import type { TwoFARequestDto } from "@/types/two-fa-request-dto";

export const authApi = {
  async register(
    data: RegistrationRequestDto
  ): Promise<ApiResponse<RegistrationResponseDto>> {
    const response = await api.post<ApiResponse<RegistrationResponseDto>>(
      "/api/User/Registration",
      data
    );
    return response.data;
  },

  async login(
    LoginRequest: LoginRequestDto
  ): Promise<ApiResponse<LoginResponseDto>> {
    const response = await api.post<ApiResponse<LoginResponseDto>>(
      "/api/Auth/Login",
      LoginRequest
    );
    return response.data;
  },

  async verifyTwoFA(
    twoFARequest: TwoFARequestDto
  ): Promise<ApiResponse<AuthResponseDto>> {
    const response = await api.post<ApiResponse<AuthResponseDto>>(
      "/api/Auth/VerifyTwoFA",
      twoFARequest
    );
    return response.data;
  },
};
