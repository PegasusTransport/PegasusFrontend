import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const errJson = error.toJSON();
    if ("status" in errJson) {
      const status = errJson.status;
      if (status == 401 || status == 403) {
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
