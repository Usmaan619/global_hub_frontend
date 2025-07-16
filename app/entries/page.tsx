"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DataEntryForm } from "@/components/data-entry-form"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuthStore } from "@/stores/auth-store"

export default function EntriesPage() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const router = useRouter()

  useEffect(() => {
    if (!currentUser) {
      router.push("/")
    }
  }, [currentUser, router])

  if (!currentUser) {
    return <div>Loading...</div>
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
                Data Entries</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-200">
                Create, manage, and organize your data entries with images and detailed information.
              </p>
            </div>
            <DataEntryForm />
          </div>
        </main>
      </div>
    </div>
  )
}
