"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore, type DataEntry } from "@/stores/auth-store"
import { toast } from "@/hooks/use-toast"
import { DataEntryFormFields } from "@/components/data-entry-form-fields"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { useThemeStore } from "@/stores/theme-store"
import { cn } from "@/lib/utils"

// Define the form data structure based on DataEntry, excluding ID and timestamps
type FormData = Omit<DataEntry, "id" | "userId" | "createdAt" | "updatedAt">

export default function EditEntryPage() {
  const { currentUser, dataEntries, updateDataEntry } = useAuthStore()
  const { sidebarCollapsed } = useThemeStore()
  const router = useRouter()
  const params = useParams()
  const entryId = params.id as string

  const [formData, setFormData] = useState<FormData>({
    recordNo: "",
    leadNo: "",
    applicantFirstName: "",
    applicantLastName: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    applicantDob: "",
    coApplicantFirstName: "",
    coApplicantLastName: "",
    bestTimeToCall: "",
    personalRemark: "",
    typeOfProperty: "",
    propertyValue: "",
    mortgageType: "",
    loanAmount: "",
    loanTerm: "",
    interestType: "",
    monthlyInstallment: "",
    existingLoan: "",
    annualIncome: "",
    downPayment: "",
    assetRemark: "",
    lenderName: "",
    loanOfficerFirstName: "",
    loanOfficerLastName: "",
    trNumber: "",
    niNumber: "",
    occupation: "",
    otherIncome: "",
    creditCardType: "",
    creditScore: "",
    officialRemark: "",
    image: "",
  })
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [entryFound, setEntryFound] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (entryId) {
      const entryToEdit = dataEntries.find((entry) => entry.id === entryId)
      if (entryToEdit) {
        // Destructure to exclude id, userId, createdAt, updatedAt
        const { id, userId, createdAt, updatedAt, ...rest } = entryToEdit
        setFormData(rest)
        setSelectedImage(entryToEdit.image)
        setEntryFound(true)
      } else {
        setEntryFound(false)
        toast({
          title: "Entry not found",
          description: "The data entry you are trying to edit does not exist.",
          variant: "destructive",
        })
        router.push("/entries") // Redirect if entry not found
      }
    }
    setLoading(false)
  }, [entryId, dataEntries, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update an entry.",
        variant: "destructive",
      })
      return
    }

    updateDataEntry(entryId, formData)
    toast({
      title: "Entry updated",
      description: "Data entry has been updated successfully.",
    })
    router.push("/entries") // Redirect back to entries list
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">Loading entry...</div>
  }

  if (!entryFound) {
    return null // Or a custom 404 page
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
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Data Entry</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Update the details for this entry.</p>
              </div>
              <Button variant="outline" onClick={() => router.push("/entries")}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Entries
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <DataEntryFormFields
                formData={formData}
                setFormData={setFormData}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                fileInputRef={fileInputRef}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Update Entry
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
