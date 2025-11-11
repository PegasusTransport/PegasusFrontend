export interface UpdateBookingDto {
  bookingId: number;
  pickUpDateTime: string; 
  pickUpAddress: string;
  pickUpLatitude: number;
  pickUpLongitude: number;
  firstStopAddress?: string;
  firstStopLatitude?: number;
  firstStopLongitude?: number;
  secondStopAddress?: string;
  secondStopLatitude?: number;
  secondStopLongitude?: number;
  dropOffAddress: string;
  dropOffLatitude: number;
  dropOffLongitude: number;
  flightnumber?: string;
  comment?: string;
}