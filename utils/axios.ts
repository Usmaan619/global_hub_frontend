// "use client";

// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // e.g., http://localhost:4000/api
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token =
//       typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
//     const session =
//       typeof window !== "undefined" ? sessionStorage.getItem("session") : null;
//     if (token) {
//       config.headers.Authorization = token;
//       config.headers["X-Session"] = session; // Add session header if needed
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("error: ", error);
//     // Example: Redirect to login if 401
//     // Forbidden: Invalid token
//     if (
//       error.response?.status === 604 &&
//       error.response?.data?.message === "Forbidden: Invalid token"
//     ) {
//       if (typeof window !== "undefined") {
//         sessionStorage.clear();
//         window.location.href = "/";
//       }
//     }

//     if (
//       error.response?.status === 603 &&
//       error.response?.data?.message ===
//         "Invalid session: session mismatch or expired"
//     ) {
//       if (typeof window !== "undefined") {
//         sessionStorage.clear();
//         window.location.href = "/";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
"use client";

import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  // baseURL: "https://api.globalhub-bpo.com/api/global_hub",
    baseURL: "http://localhost:5002/api/global_hub",
  // || process.env.NEXT_PUBLIC_API_BASE_URL || "http://13.202.180.10/api/global_hub",
  // e.g., http://localhost:4000/api
});

// Request Interceptor: Attach token and session headers
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      const session = sessionStorage.getItem("session");

      if (token) {
        config.headers.Authorization = token;
      }
      if (session) {
        config.headers["X-Session"] = session;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle session/token errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      const shouldLogout =
        (status === 604 && message === "Forbidden: Invalid token") ||
        (status === 603 &&
          message === "Invalid session: session mismatch or expired");

      if (shouldLogout) {
        sessionStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
