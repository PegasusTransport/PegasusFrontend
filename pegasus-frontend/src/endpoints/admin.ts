import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { BookingSearchRequestDto, PaginatedResult } from "@/types/booking";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import type { TaxiSettings } from "@/types/models";
import type { NewTaxiSettingsDTO } from "@/types/new-taxi-settings-dto";
import type { UpdateBookingDto } from "@/types/update-booking-dto";

export const adminApi = {
  async getTaximeterPrice(): Promise<ApiResponse<TaxiSettings>> {
    const response = await api.defaultApi.get<ApiResponse<TaxiSettings>>(
      "/api/Admin/GetAllTaxiPrices"
    );
    return response.data;
  },

  async editTaximeterPrice(
    data: NewTaxiSettingsDTO
  ): Promise<ApiResponse<TaxiSettings>> {
    const response = await api.defaultApi.post(
      "/api/Admin/CreateNewTaxiPrices",
      data
    );
    return response.data;
  },

  async getAllBookings(
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
    const response = await api.defaultApi.get("api/Admin/getAllBookings", { params });
    return response.data;
  },
  async getBookingByID(id: number): Promise<ApiResponse<BookingResponseDto>> {
    const response = await api.defaultApi.get<ApiResponse<BookingResponseDto>>(
      `/api/Admin/GetBookingById/${id}`
    );
    return response.data;
  },
  async updateBooking(
    data: UpdateBookingDto
  ): Promise<ApiResponse<BookingResponseDto>> {
    const response = await api.defaultApi.put("/api/Admin/UpdateBooking", data);
    return response.data;
  },
};
