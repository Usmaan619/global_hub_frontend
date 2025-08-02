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
  image: "",
  user_id: "",
  admin_id: "",
  record_no: "",
  lead_no: "",
  applicant_first_name: "",
  applicant_last_name: "",
  street_address: "",
  city: "",
  zip_code: "",
  applicant_dob: "",
  co_applicant_first_name: "",
  co_applicant_last_name: "",
  best_time_to_call: "",
  personal_remark: "",
  type_of_property: "",
  property_value: "",
  mortgage_type: "",
  loan_amount: "",
  loan_term: "",
  interest_type: "",
  monthly_installment: "",
  existing_loan: "",
  annual_income: "",
  down_payment: "",
  asset_remark: "",
  lender_name: "",
  loan_officer_first_name: "",
  loan_officer_last_name: "",
  tr_number: "",
  ni_number: "",
  occupation: "",
  other_income: "",
  credit_card_type: "",
  credit_score: "",
  official_remark: "",
  created_at: "",
  updated_at: "",
};

export default function CreateEntryPage() {
  const { currentUser, createDataEntry } = useAuthStore();
  const { sidebarCollapsed } = useThemeStore();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const topRef = useRef(null);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!currentUser) {
        showToast(
          "Authentication Error",
          "You must be logged in to create an entry.",
          "destructive"
        );
        return;
      }
      if (!formData.image) {
        showToast(
          "Missing Image",
          "Please upload an image before submitting.",
          "destructive"
        );
        return;
      }

      setLoading(true);
      formData.image = "text";
      const res = await createDataEntry({
        ...formData,
        user_id: currentUser.id,
      });

      if (res?.success) {
        showToast("Entry created", "Data entry has been created successfully.");
        resetForm();

        if (topRef.current) {
          // topRef.current.scrollTop = 0;
          topRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
        setLoading(false);
      }

      if (!res?.success) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // Utility functions
  const showToast = (
    title: string,
    description: string,
    variant: "destructive" | "default" = "default"
  ) => {
    toast({ title, description, variant });
  };

  const resetForm = () => {
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

            <form
              spellCheck="false"
              onSubmit={handleSubmit}
              className="space-y-6 px-10"
            >
              <DataEntryFormFields
                formData={formData}
                setFormData={setFormData}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                fileInputRef={fileInputRef}
                topRef={topRef}
                loading={loading}
              />
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
