import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type { TaxiSettings } from "@/types/models";
import type { NewTaxiSettingsDTO } from "@/types/new-taxi-settings-dto";

export const adminApi = {
  async getTaximeterPrice(): Promise<ApiResponse<TaxiSettings>> {
    const response = await api.get<ApiResponse<TaxiSettings>>(
      "/api/Admin/GetAllTaxiPrices"
    );
    return response.data;
  },

  async editTaximeterPrice(
    data: NewTaxiSettingsDTO
  ): Promise<ApiResponse<TaxiSettings>> {
    const response = await api.post("/api/Admin/CreateNewTaxiPrices", data);
    return response.data;
  },
};
