"use client";

import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react"; // Removed Copy icon
import { toast } from "@/hooks/use-toast";
import { useAuthStore, type DataEntry } from "@/stores/auth-store"; // Import DataEntry type
import { useParams } from "next/navigation";
import { useRef } from "react";

// Define the form data structure based on DataEntry, excluding ID and timestamps
type FormData = Omit<DataEntry, "id" | "user_id" | "created_at" | "updated_at">;

interface DataEntryFormFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function DataEntryFormFields({
  formData,
  setFormData,
  selectedImage,
  setSelectedImage,
  fileInputRef,
  topRef,
  loading,
}: DataEntryFormFieldsProps) {
  const params = useParams();
  const { currentUser } = useAuthStore();

  const entryId = params.id as string;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        // if (img.width === 765 && img.height === 850) {
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setFormData((prev) => ({ ...prev, image: imageUrl }));
          setSelectedImage(imageUrl);
          // toast({
          //   title: "Image uploaded",
          //   description: "Image dimensions are valid (765x850).",
          // });
        };
        reader.readAsDataURL(file);
        // } else {
        //   toast({
        //     title: "Image dimensions invalid",
        //     description: `Image must be 765x850 pixels. Current: ${img.width}x${img.height}.`,
        //     variant: "destructive",
        //   })
        //   // Clear the file input
        //   if (fileInputRef.current) {
        //     fileInputRef.current.value = ""
        //   }
        //   setFormData((prev) => ({ ...prev, image: "" }))
        //   setSelectedImage("")
        // }
        URL.revokeObjectURL(objectUrl); // Clean up the object URL
      };

      img.onerror = () => {
        toast({
          title: "Image load error",
          description: "Could not load image. Please try a different file.",
          variant: "destructive",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFormData((prev) => ({ ...prev, image: "" }));
        setSelectedImage("");
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    }
  };

  // Removed handlePaste function

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    try {
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 w-full h-full">
      {/* Image Section - Fixed on md and larger screens */}
      <div className="md:w-1/3 flex-shrink-0 space-y-4">
        <Label>Image</Label>
        <div className="border-2  border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors h-[555px] w-11/12 flex flex-col justify-center items-center">
          {selectedImage ? (
            <div className="relative group w-10/12 h-full flex items-center justify-center">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-contain  rounded transition-transform group-hover:scale-90"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              <Upload className="h-12 w-12 mx-auto mb-2" />
              <p>Click to upload image (765x850px)</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-2 bg-transparent"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Image
          </Button>
        </div>
      </div>

      {/* Form Fields Section - Scrollable on md and larger screens */}
      <div
        className="flex-1 space-y-6 md:overflow-y-auto md:pr-4 md:max-h-[calc(100vh-200px)]"
        ref={topRef}
      >
        {" "}
        {/* Adjust max-h as needed */}
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="record_no">
                  Record No <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="record_no"
                value={formData.record_no}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lead_no">
                  Lead ID <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="lead_no"
                value={formData.lead_no}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="applicant_first_name">
                  Applicant First Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="applicant_first_name"
                value={formData.applicant_first_name}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="applicant_last_name">
                  Applicant Last Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="applicant_last_name"
                value={formData.applicant_last_name}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="street_address">
                  Street Address <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="street_address"
                value={formData.street_address}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="city"
                value={formData.city}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="zip_code">
                  Zip Code <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="zip_code"
                value={formData.zip_code}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="applicant_dob">
                  Applicant DOB <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="applicant_dob"
                type="text"
                value={formData.applicant_dob}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ">
              <div className="flex items-center justify-between">
                <Label htmlFor="co_applicant_first_name">
                  Co-Applicant First Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="co_applicant_first_name"
                value={formData.co_applicant_first_name}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="co_applicant_last_name">
                  Co-Applicant Last Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="co_applicant_last_name"
                value={formData.co_applicant_last_name}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="best_time_to_call">
                  Best Time to Call <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="best_time_to_call"
                type="Text"
                value={formData.best_time_to_call}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="personal_remark">
                  Remark <span className="text-red-500">*</span>
                </Label>
              </div>
              <Textarea
                id="personal_remark"
                value={formData.personal_remark}
                onChange={handleChange}
                disabled={currentUser?.role === "admin" ? true : false}
                rows={3}
                required
              />
            </div>
          </div>
        </div>
        {/* Asset Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Asset Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="type_of_property">
                  Type of Property <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="type_of_property"
                value={formData.type_of_property}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="property_value">
                  Property Value <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="property_value"
                type="text"
                value={formData.property_value}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mortgage_type">
                  Mortgage Type <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="mortgage_type"
                value={formData.mortgage_type}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ">
              <div className="flex items-center justify-between">
                <Label htmlFor="loan_amount">
                  Loan Amount <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loan_amount"
                type="text"
                value={formData.loan_amount}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loan_term">
                  Loan Term <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loan_term"
                value={formData.loan_term}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interest_type">
                  Interest Type <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="interest_type"
                value={formData.interest_type}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthly_installment">
                  Monthly Installment <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="monthly_installment"
                type="text"
                value={formData.monthly_installment}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="existing_loan">
                  Existing Loan <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="existing_loan"
                value={formData.existing_loan}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="annual_income">
                  Annual Income <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="annual_income"
                type="text"
                value={formData.annual_income}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="down_payment">
                  Down Payment <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="down_payment"
                type="text"
                value={formData.down_payment}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="asset_remark">
                  Remark <span className="text-red-500">*</span>
                </Label>
              </div>
              <Textarea
                id="asset_remark"
                value={formData.asset_remark}
                onChange={handleChange}
                disabled={currentUser?.role === "admin" ? true : false}
                rows={3}
                required
              />
            </div>
          </div>
        </div>
        {/* Official Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Official Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lender_name">
                  Lender Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="lender_name"
                value={formData.lender_name}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loan_officer_first_name">
                  Loan Officer First Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loan_officer_first_name"
                value={formData.loan_officer_first_name}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loan_officer_last_name">
                  Loan Officer Last Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loan_officer_last_name"
                value={formData.loan_officer_last_name}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tr_number">
                  T.R # <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="tr_number"
                value={formData.tr_number}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ni_number">
                  N.I # <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="ni_number"
                value={formData.ni_number}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="occupation">
                  Occupation <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="occupation"
                value={formData.occupation}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="other_income">
                  Other Income <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="other_income"
                type="text"
                value={formData.other_income}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="credit_card_type">
                  Credit Card Type <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="credit_card_type"
                value={formData.credit_card_type}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="credit_score">
                  Credit Score <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="credit_score"
                type="text"
                value={formData.credit_score}
                disabled={currentUser?.role === "admin" ? true : false}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2 mb-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="official_remark">
                  Remarks <span className="text-red-500">*</span>
                </Label>
              </div>
              <Textarea
                id="official_remark"
                value={formData.official_remark}
                onChange={handleChange}
                disabled={currentUser?.role === "admin" ? true : false}
                rows={3}
                required
              />
            </div>
          </div>
        </div>
        {currentUser?.role !== "admin" && (
          <div className="flex justify-end">
            <Button
              type="submit"
              id="createEntryId"
              disabled={loading}
              className="w-1/4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {entryId ? "Save Entry" : "Create Entry"}
            </Button>
            {/* {!entryId && (
            <Button
              onClick={handleReset()}
              className="ms-3 w-1/4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Reset
            </Button>
          )} */}
          </div>
        )}
      </div>
    </div>
  );
}
