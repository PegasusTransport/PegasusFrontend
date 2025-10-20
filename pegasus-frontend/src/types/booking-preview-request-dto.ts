/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface BookingPreviewRequestDto {
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
    flightnumber: string;
}
