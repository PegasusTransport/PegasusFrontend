import type { ApiResponse } from "@/types/api-response-dto";
import type { BookingSearchRequestDto, PaginatedResult } from "@/types/booking";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import api from "@/plugins/axios";
import type { DriverResponseDto, ReceiptRequestDto } from "@/types/driver-info";
import type { UpdateRequestDriverDto } from "@/types/update-request-driver-dto";
import type { UpdateDriverResponseDto } from "@/types/update-driver-response-dto";

export const driverApi = {
  async getAvailableDriverBookings(
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
    const response = await api.defaultApi.get("api/Driver/Bookings/Available", {
      params,
    });
    return response.data;
  },

  async acceptJob(bookingId: number): Promise<ApiResponse<BookingResponseDto>> {
    const response = await api.defaultApi.post<ApiResponse<BookingResponseDto>>(
      `api/Driver/Bookings/${bookingId}/Accept`
    );
    return response.data;
  },
  async cancelBooking(bookingId: number) {
    const response = await api.defaultApi.post(
      `api/Driver/Bookings/${bookingId}/Cancel`
    );
    return response;
  },

  async getDriversBookings(
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
    const response = await api.defaultApi.get("api/Driver/GetMyBookings", {
      params,
    });
    return response.data;
  },

  async getDriverInfo(): Promise<ApiResponse<DriverResponseDto>> {
    const response = await api.defaultApi.get<ApiResponse<DriverResponseDto>>(
      "api/Driver/DriverInformation"
    );
    return response.data;
  },

  async sendReceipt(dto: ReceiptRequestDto): Promise<ApiResponse<boolean>> {
    const response = await api.defaultApi.post<ApiResponse<boolean>>(
      "/api/Driver/Bookings/SendReceipt",
      dto
    );
    return response.data;
  },

  async completeBooking(
    bookingId: number
  ): Promise<ApiResponse<BookingResponseDto>> {
    const response = await api.defaultApi.post<ApiResponse<BookingResponseDto>>(
      `api/Driver/Bookings/${bookingId}/Complete`
    );
    return response.data;
  },

  async updateDriverProfile(
    data: UpdateRequestDriverDto,
    id: string
  ): Promise<ApiResponse<UpdateDriverResponseDto>> {
    const response = await api.defaultApi.put<
      ApiResponse<UpdateDriverResponseDto>
    >(`/api/Driver/UpdateDriver/${id}`, data);
    return response.data;
  },
};
