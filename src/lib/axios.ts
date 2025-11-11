import axios, { AxiosError } from "axios";
import type { CustomResponse } from "@/lib/custom";
const API_BASE_URL = "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/auth/refresh-token");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", refreshError);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error("❌ Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;

export const fetchMe = async (): Promise<CustomResponse> => {
  try {
    const res = await axiosInstance.get<CustomResponse>("/auth/me");
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError && (err.response?.status === 401 || err.response?.status === 403)) {
      try {
        await axiosInstance.post("/auth/refresh-token");
        const retry = await axiosInstance.get<CustomResponse>("/auth/me");
        return retry.data;
      } catch (refreshErr) {
        console.error("❌ fetchMe refresh failed:", refreshErr);
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw refreshErr;
      }
    }
    throw err;
  }
};
