export interface DriverResponseDto {
  driverId: string
  firstName: string
  lastName: string
  profilePicture: string
  carId?: number

  carMake?: string
  carModel?: string
  carCapacity?: number
  carType?: string
  carLicensePlate?: string
}
export interface ReceiptRequestDto {
  bookingId: number;
  customerFirstname: string;
  pickupAddress: string;
  stops?: string; 
  destination: string;
  driverFirstname: string;
  licensePlate: string;
  driverImageUrl?: string;

  pickupTime: string; 
  distanceKm: number;
  durationMinutes: string;
  totalPrice: number;
}