"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const { currentUser, PortalLock } = useAuthStore();
  const router = useRouter();

  console.log("currentUser: ", currentUser);
  useEffect(() => {
    if (currentUser?.role === "superadmin") {
      router.push("/dashboard");
    }

    // if (PortalLock) {
    if (currentUser?.role === "admin") {
      router.push("/dashboard");
    }
    if (currentUser?.role === "user") {
      router.push("/dashboard");
    }
    // }
  }, [currentUser, router]);

  if (currentUser) {
    return <div>Redirecting...</div>;
  }

  return <LoginForm />;
}

// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/stores/auth-store";
// import { LoginForm } from "@/components/login-form";

// export default function LoginPage() {
//   const router = useRouter();
//   const currentUser = useAuthStore((state) => state.currentUser);
//   console.log('currentUser?.role: ', currentUser?.role);

//   useEffect(() => {
//     if (currentUser?.role === "superadmin") {
//       router.push("/dashboard");
//     } else if (currentUser?.role === "admin") {
//       router.push("/admin");
//     } else if (currentUser?.role === "user") {
//       router.push("/entries");
//     }
//   }, [currentUser]);

//   if (currentUser) return <div>Redirecting...</div>;

//   return <LoginForm />;
// }
