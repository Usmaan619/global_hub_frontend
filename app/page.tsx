"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const router = useRouter();
  const { currentUser, restoreSession } = useAuthStore();

  const [checking, setChecking] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false); // Track if on client

  //  Set mounted true once client-side rendering is confirmed
  useEffect(() => {
    setMounted(true);
  }, []);

  //  Mobile detection (only after mount)
  useEffect(() => {
    if (!mounted) return;

    const isMobileDevice = /iPhone|iPad|iPod|Android|Mobile/i.test(
      navigator.userAgent
    );
    setIsMobile(isMobileDevice);
  }, [mounted]);

  useEffect(() => {
    const checkSession = async () => {
      await restoreSession(); // Restore user session
      setChecking(false);
    };

    if (mounted && !isMobile) {
      checkSession();
    }
  }, [restoreSession, mounted, isMobile]);

  useEffect(() => {
    if (
      currentUser?.role === "superadmin" ||
      currentUser?.role === "admin" ||
      currentUser?.role === "user"
    ) {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  //  Don't render anything until client is mounted
  if (!mounted) return null;

  //  Block mobile access
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Mobile Not Supported
          </h1>
          <p className="text-gray-700 mb-6">
            This application is designed for desktop use only. Please open it on
            a desktop or laptop browser.
          </p>
          {/* <img
            src="/no-mobile.svg"
            alt="No Mobile Support"
            className="mx-auto w-32 h-32 opacity-80"
          /> */}
        </div>
      </div>
    );
  }

  //  While checking session
  if (checking) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  //  If already logged in
  if (
    currentUser?.role === "superadmin" ||
    currentUser?.role === "admin" ||
    currentUser?.role === "user"
  ) {
    return null;
  }

  return <LoginForm />;
}
