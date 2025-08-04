"use client";

import type React from "react";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { useThemeStore } from "@/stores/theme-store";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useThemeStore();
  const pathname = usePathname();
  const { fetchLockStatus, currentUser, logout } = useAuthStore();

  // useEffect(() => {
  //   const fetchLockStatusApi = async () => {
  //     const res: any = await fetchLockStatus();
  //     console.log("res:-----------ClientLayout ", res);
  //     if (currentUser?.role !== "superadmin" && res) {
  //       logout();
  //     }
  //   };
  //   fetchLockStatusApi();
  // }, [pathname]);

  useEffect(() => {
    // Apply theme on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
