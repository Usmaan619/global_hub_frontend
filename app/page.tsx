"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  console.log("currentUser: ", currentUser);
  useEffect(() => {
    if (currentUser?.role === "super_admin") {
      router.push("/dashboard");
    }
    if (currentUser?.role === "user") {
      router.push("/entries");
    }
  }, [currentUser, router]);

  if (currentUser) {
    return <div>Redirecting...</div>;
  }

  return <LoginForm />;
}
