"use client";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g., http://localhost:4000/api
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error: ", error);
    // Example: Redirect to login if 401
    // Forbidden: Invalid token
    if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Forbidden: Invalid token"
    ) {
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
