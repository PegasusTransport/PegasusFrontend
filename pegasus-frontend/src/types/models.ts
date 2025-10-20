// models.ts

// ----------------- UserRoles -----------------
export enum UserRoles {
    User = "User",
    Driver = "Driver",
    Admin = "Admin",
}

// ----------------- BookingStatus -----------------
export enum BookingStatus {
    PendingEmailConfirmation = "PendingEmailConfirmation",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Completed = "Completed",
}

// ----------------- TaxiSettings -----------------
export interface TaxiSettings {
    id: number;
    kmPrice: number;
    minutePrice: number;
    startPrice: number;
    zonePrice: number;
    updatedAt: Date;
}

// ----------------- User -----------------
export interface User {
    firstName: string;
    lastName: string;
    refreshToken?: string | null;
    refreshTokenExpireTime?: Date | null;
    isDeleted: boolean;
    deletedAt?: Date | null;
    driver?: Drivers | null;
}

// ----------------- Cars -----------------
export interface Cars {
    carId: number;
    make: string;
    model: string;
    type?: string | null;
    capacity: number;
    licensePlate: string;
    driver?: Drivers | null;
}

// ----------------- Drivers -----------------
export interface Drivers {
    driverId: string; // Guid as string
    userId: string;
    user: User;
    carId?: number | null;
    car?: Cars | null;
    profilePicture: string;
    isDeleted: boolean;
    deletedAt?: Date | null;
    bookings: Bookings[];
}

// ----------------- Bookings -----------------
export interface Bookings {
    bookingId: number;
    userIdFk?: string | null;
    guestEmail?: string | null;
    guestFirstName?: string | null;
    guestLastName?: string | null;
    guestPhoneNumber?: string | null;
    driverIdFK?: string | null; // Guid as string
    price: number;
    bookingDateTime: Date;
    pickUpDateTime: Date;
    pickUpAdress: string;
    pickUpLatitude: number;
    pickUpLongitude: number;
    firstStopAddress?: string | null;
    firstStopLatitude?: number | null;
    firstStopLongitude?: number | null;
    secondStopAddress?: string | null;
    secondStopLatitude?: number | null;
    secondStopLongitude?: number | null;
    dropOffAdress: string;
    dropOffLatitude: number;
    dropOffLongitude: number;
    distanceKm: number;
    durationMinutes: number;
    flightnumber?: string | null;
    comment?: string | null;
    status: BookingStatus;
    confirmationToken?: string | null;
    confirmationTokenExpiresAt?: Date | null;
    isConfirmed: boolean;
    isAvailable: boolean;
    user?: User | null;
    driver?: Drivers | null;
}
