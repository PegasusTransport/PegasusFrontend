import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { BookingSearchRequestDto, PaginatedResult } from "@/types/booking";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import type { UpdateBookingDto } from "@/types/update-booking-dto";
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
  async getUserBookings(
    query: BookingSearchRequestDto
  ): Promise<ApiResponse<PaginatedResult<BookingResponseDto>>> {
    const params = {
      ...query,
      fromDate: query.fromDate
        ? new Date(query.fromDate).toLocaleDateString()
        : undefined,
      toDate: query.toDate
        ? new Date(query.toDate).toLocaleDateString()
        : undefined,
    };
    const response = await api.defaultApi.get("api/Booking/getMyBookings", {
      params,
    });
    return response.data;
  },
  async getBookingById(id: number): Promise<ApiResponse<BookingResponseDto>> {
    const response = await api.defaultApi.get<ApiResponse<BookingResponseDto>>(
      `api/Booking/GetBookingById/${id}`
    );
    return response.data;
  },
  async cancelBooking(id: number): Promise<ApiResponse<boolean>> {
    const response = await api.defaultApi.put<ApiResponse<boolean>>(
      `api/Booking/CancelBooking/${id}`
    );
    return response.data;
  },

  async updateBooking(
    data: UpdateBookingDto
  ): Promise<ApiResponse<BookingResponseDto>> {
    const response = await api.defaultApi.put(
      "/api/Booking/updateBooking",
      data
    );
    return response.data;
  },
};
