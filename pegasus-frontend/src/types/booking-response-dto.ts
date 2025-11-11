/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { BookingStatus } from "./booking-status";

export interface BookingResponseDto {
    bookingId: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    isGuestBooking: boolean;
    price: number;
    bookingDateTime: Date;
    pickUpDateTime: Date;
    pickUpAddress: string;
    pickUpLatitude: number;
    pickUpLongitude: number;
    firstStopAddress: string;
    firstStopLatitude: number;
    firstStopLongitude: number;
    secondStopAddress: string;
    secondStopLatitude: number;
    secondStopLongitude: number;
    dropOffAddress: string;
    dropOffLatitude: number;
    dropOffLongitude: number;
    distanceKm: number;
    durationMinutes: number;
    flightnumber: string;
    comment: string;
    status: BookingStatus;
    isConfirmed: boolean;
    driverId: string;
}
