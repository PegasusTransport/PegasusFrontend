import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";


const authApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

authApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (
      originalRequest.url === "/api/Auth/RefreshToken" &&
      error.response?.status === 401
    ) {
      logout();
    }

    return Promise.reject(error);
  }
);

const defaultApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

defaultApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authApi.post("/api/Auth/RefreshToken");
        return defaultApi(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      logout();
    }

    return Promise.reject(error);
  }
);

const logout = () => {
  const authStore = useAuthStore();
  authStore.logout();
};

export default { authApi, defaultApi: defaultApi };
