"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/stores/auth-store";
import { UserOverview } from "@/components/user-overview";
import { AmdinManagement } from "@/components/admin-management";

export default function UsersPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    } else if (currentUser.role === "user") {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role === "user") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className=" mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                Admin Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
                Manage and monitor your team members and their activities.
              </p>
            </div>
            <div className="space-y-6">
              <AmdinManagement />
              <UserOverview />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
