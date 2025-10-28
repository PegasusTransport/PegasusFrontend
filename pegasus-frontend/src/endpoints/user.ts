import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { UpdateUserRequestDto } from "@/types/update-user-request-dto";
import type { UpdateUserResponseDto } from "@/types/update-user-response-dto";

export const userApi = {
  async updateProfile(
    data: UpdateUserRequestDto
  ): Promise<ApiResponse<UpdateUserResponseDto>> {
    const response = await api.post<ApiResponse<UpdateUserResponseDto>>(
      "/api/User/UpdateUser",
      data
    );
    return response.data;
  },
};
