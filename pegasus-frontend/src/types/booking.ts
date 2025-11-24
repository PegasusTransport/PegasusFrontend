export enum SortOrder {
  Asc = 0,
  Desc = 1,
}

export enum BookingStatusForCustomers {
  Confirmed = 0,
  Cancelled = 1,
  Completed = 2,
}
export enum BookingStatus {
  PendingEmailConfirmation = 0,
  Confirmed = 1,
  Cancelled = 2,
  Completed = 3,
}

// Helper function to convert enum to display string
export const getBookingStatusString = (status: BookingStatus): string => {
  switch (status) {
    case BookingStatus.PendingEmailConfirmation:
      return "Pending";
    case BookingStatus.Confirmed:
      return "Confirmed";
    case BookingStatus.Cancelled:
      return "Cancelled";
    case BookingStatus.Completed:
      return "Completed";
    default:
      return "Unknown";
  }
};

// Helper function to check if booking can be edited
export const canEditBookingStatus = (status: BookingStatus): boolean => {
  return (
    status !== BookingStatus.Completed && status !== BookingStatus.Cancelled
  );
};

// Interfaces
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  currentCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface BookingSearchRequestDto {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  minPrice?: number;
  maxPrice?: number;
  fromDate?: string;
  toDate?: string;
  status?: BookingStatusForCustomers;
  upcomingOnly?: boolean;
}
export enum BookingPeriodHelper {
  Past = 0,
  Current = 1,
  Future = 2,
  Today = 3,
  ThisWeek = 4,
  ThisMonth = 5,
}

export interface BookingFilterRequestForAdminDto {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: BookingStatusForCustomers;
  driverAssigned?: boolean;
  date?: string;
  month?: number;
  year?: number;
  fromDate?: string;
  toDate?: string;
  period?: BookingPeriodHelper;
  sortBy?: string;
  sortOrder?: SortOrder;
  pickupAddress?: string;
  dropoffAddress?: string;
  flightNumber?: string;
  customerName?: string;
  driverName?: string;
  hoursUntilPickup?: number;
}

export type BookingFilterParams = Partial<BookingFilterRequestForAdminDto>;

const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

export const defaultBookingFilter: BookingFilterRequestForAdminDto = {
  page: 1,
  pageSize: 5,
  sortBy: "pickUpDateTime",
  sortOrder: SortOrder.Asc,
  period: BookingPeriodHelper.Current,
  status: 1
};
