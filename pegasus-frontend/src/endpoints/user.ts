import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { UpdateUserRequestDto } from "@/types/update-user-request-dto";
import type { UpdateUserResponseDto } from "@/types/update-user-response-dto";
import type { UserResponseDto } from "@/types/user-response-dto";

export const userApi = {
  async updateProfile(
    data: UpdateUserRequestDto
  ): Promise<ApiResponse<UpdateUserResponseDto>> {
    const response = await api.defaultApi.put<
      ApiResponse<UpdateUserResponseDto>
    >("/api/User/UpdateUser", data);
    return response.data;
  },
  async getUserProfile(): Promise<ApiResponse<UserResponseDto>> {
    const response = await api.defaultApi.get<ApiResponse<UserResponseDto>>(
      "/api/User/GetLoggedInUserData"
    );
    return response.data;
  },
};
