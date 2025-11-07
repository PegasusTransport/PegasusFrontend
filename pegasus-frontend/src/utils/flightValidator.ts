export const validateFlightNumber = (flightNumber: string): boolean => {
  const flightPattern = /^[A-Z]{2,3}\d{1,4}$/i;

  return flightPattern.test(flightNumber.trim());
};
