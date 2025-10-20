import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { RegistrationRequestDto } from "@/types/registration-request-dto";
import type { RegistrationResponseDto } from "@/types/registration-response-dto";

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
};
