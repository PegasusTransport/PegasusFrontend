const setIsAuthenticatedCookie = (days: number) => {
  console.log("Trying to set cookie!");
  // const EXPIRATION_TIME_IN_MS = 1 * 60 * 1000; // 1 minute in milliseconds. For testing
  const EXPIRATION_TIME_IN_MS = days * 24 * 60 * 60 * 1000;
  const expiresAt = new Date().getTime() + EXPIRATION_TIME_IN_MS;
  localStorage.setItem(
    "isAuthenticated",
    JSON.stringify({ expiresAt: expiresAt })
  );
};

const removeIsAuthenticatedCookie = () => {
  localStorage.removeItem("isAuthenticated");
};

const isUserAuthenticated = (): boolean => {
  const item = localStorage.getItem("isAuthenticated");
  if (!item) return false;

  const { expiresAt } = JSON.parse(item);
  if (new Date().getTime() > expiresAt) {
    localStorage.removeItem("isAuthenticated");
    return false;
  }

  return true;
};

export default {
  setIsAuthenticatedCookie,
  removeIsAuthenticatedCookie,
  isUserAuthenticated,
};
