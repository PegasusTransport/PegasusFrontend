import api from "@/plugins/axios";
import type { AllDriversRequestDto } from "@/types/all-drivers-dto";
import type { ApiResponse } from "@/types/api-response-dto";
import type { BookingSearchRequestDto, PaginatedResult } from "@/types/booking";
import type { BookingResponseDto } from "@/types/booking-response-dto";
import type { CreateRequestDriverDto } from "@/types/create-request-driver-dto";
import type { AvailableDriverResponsDto } from "@/types/driver-info";
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
    const response = await api.defaultApi.get("api/Admin/getAllBookings", {
      params,
    });
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

  async getDrivers(): Promise<ApiResponse<AllDriversRequestDto[]>> {
    const response = await api.defaultApi.get("/api/Admin/GetAllDrivers");
    return response.data;
  },

  async deleteDriver(id: string): Promise<ApiResponse<boolean>> {
    const response = await api.defaultApi.delete(
      `/api/Admin/DeleteDriver/${id}​`
    );
    return response.data;
  },

  async addDriver(data: CreateRequestDriverDto): Promise<ApiResponse<boolean>> {
    const response = await api.defaultApi.post("/api/Admin/CreateDriver", data);
    return response.data;
  },

  async findAvailableDriverForBooking(
    bookingId: number
  ): Promise<ApiResponse<AvailableDriverResponsDto[]>> {
    const response = await api.defaultApi.get(
      `/api/Admin/GetAvailableDrivers/${bookingId}`
    );
    return response.data;
  },
  async assignDriverToBooking(
    bookingId: number,
    driverId: string
  ): Promise<ApiResponse<boolean>> {
    const cleanDriverId = driverId.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  const response = await api.defaultApi.put(
    `/api/Admin/AssignDriver/${bookingId}/${cleanDriverId}`
  );
  return response.data;
  },

  async createAdmin(email:string):Promise<ApiResponse<boolean>>{
    const response = await api.defaultApi.post(
      `/api/Admin/CreateAdmin/${email}`
    );
    return response.data;
  }
};
