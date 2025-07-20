"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore, type DataEntry } from "@/stores/auth-store";
import { toast } from "@/hooks/use-toast";
import { DataEntryFormFields } from "@/components/data-entry-form-fields";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useThemeStore } from "@/stores/theme-store";
import { cn } from "@/lib/utils";

// Define the form data structure based on DataEntry, excluding ID and timestamps
type FormData = Omit<DataEntry, "id" | "userId" | "createdAt" | "updatedAt">;
const initialFormData: FormData = {
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
};

export default function CreateEntryPage() {
  const { currentUser, createDataEntry } = useAuthStore();
  const { sidebarCollapsed } = useThemeStore();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create an entry.",
        variant: "destructive",
      });
      return;
    }
    console.log("formData: ", formData);

    createDataEntry({
      ...formData,
      user_id: currentUser.id,
    });
    toast({
      title: "Entry created",
      description: "Data entry has been created successfully.",
    });
    // router.push("/entries") // Redirect back to entries list
    setFormData(initialFormData);
    setSelectedImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setSelectedImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-0" : "ml-0"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Create New Data Entry
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Fill in the details for your new entry.
                </p>
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
                handleReset={handleReset}
              />
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
