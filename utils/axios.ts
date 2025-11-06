
"use client";

import { toast } from "@/hooks/use-toast";
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
    console.log(
      'error:typeof window !== "undefined" axios interceptor ',
      error
    );
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      console.log("status: ", status, message);

      const shouldLogout =
        (status === 604 && message === "Forbidden: Invalid token") ||
        (status === 603 &&
          message === "Invalid session: session mismatch or expired");

      if (shouldLogout) {
        sessionStorage.clear();
        window.location.href = "/";
      }
      const accountLocked =
        status === 403 && message === "User account is locked.";
      if (accountLocked) {
        toast({
          title: "Account Locked",
          description: "Your account has been locked. Please contact support.",
          duration: 9000,
          variant: "destructive",
        });

        setTimeout(() => {
          sessionStorage.clear();
          window.location.href = "/";
        }, 4000);
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
