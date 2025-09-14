"use client";

import type React from "react";
import { useEffect } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { useThemeStore } from "@/stores/theme-store";
import { useGlobalSecurity } from "@/hooks/useGlobalSecurity";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useGlobalSecurity();

  // intervalMs: 0 रखें जब तक periodic re-apply की जरूरत न हो
  // useGlobalSecurity({ intervalMs: 1000, blockDevShortcuts: true });

  const { theme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContext);
    return () => document.removeEventListener("contextmenu", handleContext);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className} data-secure-root>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
