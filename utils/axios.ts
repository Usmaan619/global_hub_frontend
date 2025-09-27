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
// your_secure_password
// Create Axios instance
const axiosInstance = axios.create({
  baseURL: "https://api.globalhub-bpo.com/api/global_hub",
  // baseURL: "http://localhost:5002/api/global_hub",
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
    console.log('error:typeof window !== "undefined" axios interceptor ', error);
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      console.log('status: ', status);

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




// server {
//     listen 443 ssl;
//     server_name globalhub-bpo.com www.globalhub-bpo.com;

//     root /usr/share/nginx/next-site;
//     index index.html;

//     ssl_certificate /etc/letsencrypt/live/globalhub-bpo.com/fullchain.pem;
//     ssl_certificate_key /etc/letsencrypt/live/globalhub-bpo.com/privkey.pem;
//     include /etc/letsencrypt/options-ssl-nginx.conf;
//     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

//     # ✅ Static files with long cache (Next.js hashed assets)
//     location ~* ^/_next/static/ {
//         access_log off;
//         add_header Cache-Control "public, max-age=31536000, immutable";
//         try_files $uri =404;
//     }

//     # ✅ All other static assets (images, CSS, JS, fonts, etc.)
//     location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf|webp|json)$ {
//         access_log off;
//         add_header Cache-Control "public, max-age=31536000, immutable";
//         try_files $uri =404;
//     }

//     # ⚠ HTML files – disable caching
//     location ~* \.html$ {
//         add_header Cache-Control "no-cache, no-store, must-revalidate";
//         try_files $uri =404;
//     }

//     # 🔄 Fallback for SPA (if route not found, serve index.html)
//     location / {
//         try_files $uri $uri/ /index.html;
//     }
// }
