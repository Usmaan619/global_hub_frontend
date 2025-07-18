"use client";

import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react"; // Removed Copy icon
import { toast } from "@/hooks/use-toast";
import type { DataEntry } from "@/stores/auth-store"; // Import DataEntry type
import { postData } from "@/services/api";

// Define the form data structure based on DataEntry, excluding ID and timestamps
type FormData = Omit<DataEntry, "id" | "userId" | "createdAt" | "updatedAt">;

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
}: DataEntryFormFieldsProps) {
  
  console.log('formData: ', formData);

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
          toast({
            title: "Image uploaded",
            description: "Image dimensions are valid (765x850).",
          });
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

    console.log("e.target: ", e.target);
    try {
      // const response = await postData("/create/record", payload);
      console.log("formData: ", formData);

      return { success: true };
    } catch (error) {
      console.error("Create data entry error:", error);
      return { success: false };
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 w-full h-full">
      {/* Image Section - Fixed on md and larger screens */}
      <div className="md:w-1/3 flex-shrink-0 space-y-4">
        <Label>Image</Label>
        <div className="border-2  border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors h-[600px] flex flex-col justify-center items-center">
          {selectedImage ? (
            <div className="relative group w-full h-full flex items-center justify-center">
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
      <div className="flex-1 space-y-6 md:overflow-y-auto md:pr-4 md:max-h-[calc(100vh-200px)]">
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
                <Label htmlFor="recordNo">
                  Record No <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="recordNo"
                value={formData.recordNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="leadNo">
                  Lead No <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="leadNo"
                value={formData.leadNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="applicantFirstName">
                  Applicant First Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="applicantFirstName"
                value={formData.applicantFirstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="applicantLastName">
                  Applicant Last Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="applicantLastName"
                value={formData.applicantLastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="streetAddress">
                  Street Address <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
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
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="zipCode">
                  Zip Code <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="applicantDob">
                  Applicant DOB <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="applicantDob"
                type="text"
                value={formData.applicantDob}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ">
              <div className="flex items-center justify-between">
                <Label htmlFor="coApplicantFirstName">
                  Co-Applicant First Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="coApplicantFirstName"
                value={formData.coApplicantFirstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="coApplicantLastName">
                  Co-Applicant Last Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="coApplicantLastName"
                value={formData.coApplicantLastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bestTimeToCall">
                  Best Time to Call <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="bestTimeToCall"
                type="Text"
                value={formData.bestTimeToCall}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="personalRemark">
                  Remark <span className="text-red-500">*</span>
                </Label>
              </div>
              <Textarea
                id="personalRemark"
                value={formData.personalRemark}
                onChange={handleChange}
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
                <Label htmlFor="typeOfProperty">
                  Type of Property <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="typeOfProperty"
                value={formData.typeOfProperty}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="propertyValue">
                  Property Value <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="propertyValue"
                type="text"
                value={formData.propertyValue}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mortgageType">
                  Mortgage Type <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="mortgageType"
                value={formData.mortgageType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanAmount">
                  Loan Amount <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loanAmount"
                type="text"
                value={formData.loanAmount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanTerm">
                  Loan Term <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loanTerm"
                value={formData.loanTerm}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interestType">
                  Interest Type <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="interestType"
                value={formData.interestType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyInstallment">
                  Monthly Installment <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="monthlyInstallment"
                type="text"
                value={formData.monthlyInstallment}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="existingLoan">
                  Existing Loan <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="existingLoan"
                value={formData.existingLoan}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="annualIncome">
                  Annual Income <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="annualIncome"
                type="text"
                value={formData.annualIncome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="downPayment">
                  Down Payment <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="downPayment"
                type="text"
                value={formData.downPayment}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="assetRemark">
                  Remark <span className="text-red-500">*</span>
                </Label>
              </div>
              <Textarea
                id="assetRemark"
                value={formData.assetRemark}
                onChange={handleChange}
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
                <Label htmlFor="lenderName">
                  Lender Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="lenderName"
                value={formData.lenderName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanOfficerFirstName">
                  Loan Officer First Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loanOfficerFirstName"
                value={formData.loanOfficerFirstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanOfficerLastName">
                  Loan Officer Last Name <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="loanOfficerLastName"
                value={formData.loanOfficerLastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="trNumber">
                  T.R # <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="trNumber"
                value={formData.trNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="niNumber">
                  N.I # <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="niNumber"
                value={formData.niNumber}
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
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="otherIncome">
                  Other Income <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="otherIncome"
                type="text"
                value={formData.otherIncome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="creditCardType">
                  Credit Card Type <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="creditCardType"
                value={formData.creditCardType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 ps-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="creditScore">
                  Credit Score <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                id="creditScore"
                type="text"
                value={formData.creditScore}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 col-span-full ps-2 mb-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="officialRemark">
                  Remarks <span className="text-red-500">*</span>
                </Label>
              </div>
              <Textarea
                id="officialRemark"
                value={formData.officialRemark}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="w-1/4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            Create Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
