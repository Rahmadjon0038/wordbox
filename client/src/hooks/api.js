import axios from "axios";
import Cookies from "js-cookie";
export const instance = axios.create({
  baseURL: process.env.API || "http://localhost:5003",
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Request xatosi:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall =
      typeof originalRequest.url === "string" &&
      originalRequest.url.includes("/api/auth/refresh");

    if (isUnauthorized && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      try {
        const refreshRes = await instance.post("/api/auth/refresh");
        const newToken = refreshRes.data?.token;
        if (newToken) {
          Cookies.set("token", newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return instance(originalRequest);
      } catch (refreshErr) {
        Cookies.remove("token");
        Cookies.remove("role");
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
