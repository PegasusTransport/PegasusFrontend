export const validateBookingDateTime = (travelDateTime: string | Date): boolean => {
  try {
    const travelDate = new Date(travelDateTime);
    const currentDate = new Date();
    
    if (isNaN(travelDate.getTime())) {
      return false;
    }
    
    const timeDifference = travelDate.getTime() - currentDate.getTime();
    
    const fortyEightHoursInMs = 48 * 60 * 60 * 1000;
    
    return timeDifference >= fortyEightHoursInMs;
  } catch (error) {
    return false;
  }
};