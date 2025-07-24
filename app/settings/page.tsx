"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";
import { SettingsForm } from "@/components/settings-form";

export default function SettingsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { sidebarCollapsed } = useThemeStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 transition-colors duration-200">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-0" : "ml-0"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6 animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
                Manage your account preferences and application settings.
              </p>
            </div>
            <SettingsForm />
          </div>
        </main>
      </div>
    </div>
  );
}
