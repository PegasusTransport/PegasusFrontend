export const checkIfBookingCanBeCancelled = (bookingTime: string): boolean => {
  const bookingDate = new Date(bookingTime);
  const now = new Date();
  const twentyfourHours = 24 * 60 * 60 * 1000;

  return bookingDate.getTime() - now.getTime() >= twentyfourHours;
};

