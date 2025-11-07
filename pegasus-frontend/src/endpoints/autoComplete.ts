import api from "@/plugins/axios";
import type { ApiResponse } from "@/types/api-response-dto";
import type {
  AutocompleteRequestDto,
  AutoCompleteResponseDto,
  PlaceIdRequestDto,
} from "@/types/autocomplete";
import type { CoordinateDto } from "@/types/coordinate-dto";

export const autoComplete = {
  async postSuggestions(
    data: AutocompleteRequestDto
  ): Promise<ApiResponse<AutoCompleteResponseDto>> {
    const response = await api.defaultApi.post<ApiResponse<AutoCompleteResponseDto>>(
      "api/Map/AutoComplete",
      data
    );
    return response.data;
  },
 async getCoordinates(request: PlaceIdRequestDto): Promise<ApiResponse<CoordinateDto>> {
  const response = await api.defaultApi.get<ApiResponse<CoordinateDto>>("/api/Map/GetLongNLat", {
    params: request,
  });

  return response.data;
},
};
