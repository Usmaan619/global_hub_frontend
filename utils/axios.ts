"use client";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g., http://localhost:4000/api
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example: Redirect to login if 401
    // if (error.response?.status === 401) {
    //   if (typeof window !== "undefined") {
    //     localStorage.removeItem("token");
    //     window.location.href = "/login";
    //   }
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
