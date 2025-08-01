"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
type FormData = Omit<DataEntry, "id" | "user_id" | "created_at" | "updated_at">;

export default function EditEntryPage() {
  const { currentUser, dataEntries, updateDataEntry, entryId } = useAuthStore();
  const { sidebarCollapsed } = useThemeStore();
  const router = useRouter();
  // 
  const params = useParams();
  

  // const { id } = router?.query;
  // 

  //  const searchParams = useSearchParams();
  // const id = searchParams.get('id');;
  // 

  // const entryId = params.id as string;
  // const entryId = id as string;
  const [formData, setFormData] = useState<FormData>({
    image: "",
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
  });
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [entryFound, setEntryFound] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef(null);

  useEffect(() => {
    if (entryId) {
      const entryToEdit = dataEntries.find(
        (entry) => parseInt(entry.id) === parseInt(entryId)
      );
      if (entryToEdit) {
        

        // Destructure to exclude id, userId, createdAt, updatedAt
        const { id, user_id, created_at, updated_at, ...rest } = entryToEdit;
        setFormData(rest);
        setSelectedImage(entryToEdit.image);
        setEntryFound(true);
      } else {
        setEntryFound(false);
        toast({
          title: "Entry not found",
          description: "The data entry you are trying to edit does not exist.",
          variant: "destructive",
        });
        router.push("/entries"); // Redirect if entry not found
      }
    }
    setLoading(false);
  }, [entryId, dataEntries, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update an entry.",
        variant: "destructive",
      });
      return;
    }

    const res = await updateDataEntry(entryId, formData);
    if (res) {
      if (topRef.current) {
        // topRef.current.scrollTop = 0;
        topRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }

    // toast({
    //   title: "Entry updated",
    //   description: "Data entry has been updated successfully.",
    // });
    router.push("/entries"); // Redirect back to entries list
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        Loading entry...
      </div>
    );
  }

  if (!entryFound) {
    return null; // Or a custom 404 page
  }

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
                  Edit Data Entry
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Update the details for this entry.
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
                topRef={topRef}
              />
              {/* <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                Update Entry
              </Button> */}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
