"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dashboard } from "@/components/dashboard"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuthStore } from "@/stores/auth-store"
import { useThemeStore } from "@/stores/theme-store"
import { AdminDashboard } from "@/components/admin-dashboard"
import { SuperAdminDashboard } from "@/components/super-admin-dashboard"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const { sidebarCollapsed } = useThemeStore()
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/")
    }
  }, [currentUser, router])

  // if (!currentUser) {
  //   return <div>Loading...</div>
  // }

  const renderDashboard = () => {
    switch (currentUser?.role) {
      case "superadmin":
        return <SuperAdminDashboard />
      // case "admin":
      //   return <AdminDashboard />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-0" : "ml-0",
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
                Welcome back, {currentUser?.name}. Here's what's happening today.
              </p>
            </div>
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  )
}
