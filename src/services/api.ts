// services/api.ts
import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_CONSTANT } from "../utils/constant";

const api: AxiosInstance = axios.create({
  baseURL: API_CONSTANT, // Remove extra space
});

// Request Interceptor - Get token from localStorage
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token directly from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
