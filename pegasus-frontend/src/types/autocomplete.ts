export interface AutocompleteRequestDto {
  input: string;
  sessionToken: string;
}

export interface AutoCompleteResponseDto {
  suggestions: AutoCompleteSuggestionDto[];
}

export interface AutoCompleteSuggestionDto {
  description: string;
  placeId: string;
}

export interface PlaceIdRequestDto {
  placeId: string;
  sessionToken?: string | null;
}
export interface CoordinateDto {
  latitude: number;
  longitude: number;
}
