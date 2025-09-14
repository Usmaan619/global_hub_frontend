// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useAuthStore } from "@/stores/auth-store";
// import { toast } from "@/hooks/use-toast";
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Search,
//   X,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { deleteData } from "@/services/api";
// import moment from "moment";

// export function DataEntryForm() {
//   const {
//     currentUser,
//     dataEntries,
//     deleteDataEntry,
//     getDataEntriesByUser,
//     users,
//     setDataEntryId,
//   } = useAuthStore();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);

//   const router = useRouter();

//   const userEntries =
//     currentUser?.role === "user" ||
//     currentUser?.role === "superadmin" ||
//     currentUser?.role === "admin"
//       ? dataEntries
//       : [];

//   const fetchDataEntries = useAuthStore((state) => state.fetchDataEntries);

//   useEffect(() => {
//     fetchDataEntries();
//   }, [currentUser]);

//   const filteredEntries = useMemo(() => {
//     if (!searchTerm.trim()) return userEntries;

//     const searchLower = searchTerm.toLowerCase();
//     return userEntries.filter((entry) =>
//       entry.record_no.toLowerCase().includes(searchLower)
//     );
//   }, [userEntries, searchTerm]);

//   const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentEntries = filteredEntries.slice(startIndex, endIndex);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   const clearSearch = () => {
//     setSearchTerm("");
//   };

//   const getUserName = (userId: string) => {
//     const user = users.find((u) => u.id === userId);
//     return user?.name || "Unknown User";
//   };

//   const handleDelete = async (entryId: string) => {
//     try {
//       const res = await deleteData(`delete/record/by/id/${entryId}`);

//       if (res?.success) {
//         deleteDataEntry(entryId);
//         toast({
//           title: "Entry deleted",
//           description: "Data entry has been deleted successfully.",
//         });
//       }
//     } catch (error) {
//       const err = error as any;

//       toast({
//         title: err?.message,
//         description: "Data entry has been deleted successfully.",
//       });
//     }
//   };

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <div>
//               <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 My Entries ( {filteredEntries?.length} )
//               </CardTitle>

//               <CardDescription className="text-gray-600 dark:text-gray-300">
//                 Manage your data entries ({filteredEntries?.length} entries)
//               </CardDescription>
//             </div>
//             <Button
//               onClick={() => router.push("/entries/create")}
//               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add Entry
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Enhanced Search */}
//           <div className="flex items-center space-x-2 mb-6">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search by record no..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
//               />
//               {searchTerm && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearSearch}
//                   className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               )}
//             </div>
//             <Badge variant="secondary" className="px-3 py-1">
//               {filteredEntries?.length} results
//             </Badge>
//           </div>

//           {/* Entries Table */}
//           <div className="rounded-lg border overflow-hidden">
//             <Table>
//               <TableHeader className="bg-gray-50 dark:bg-gray-800">
//                 <TableRow>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Actions
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Record No
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Lead ID
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Applicant First Name
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Applicant Last Name
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Street Address
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     City
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Zip Code
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Applicant DOB
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Co-Applicant First Name
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Co-Applicant Last Name
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Best Time to Call
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Personal Remark
//                   </TableHead>

//                   {/* Asset Info */}
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Type of Property
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Property Value
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Mortgage Type
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Loan Amount
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Loan Term
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Interest Type
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Monthly Installment
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Existing Loan
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Annual Income
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Down Payment
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Asset Remark
//                   </TableHead>

//                   {/* Official Info */}
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Lender Name
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Loan Officer First Name
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Loan Officer Last Name
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     T.R #
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     N.I #
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Occupation
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Other Income
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Credit Card Type
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Credit Score
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Official Remark
//                   </TableHead>
//                   <TableHead className=" min-w-[200px] max-w-[300px]">
//                     Created Date
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>

//               <TableBody>
//                 {currentEntries?.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={35} className="text-center py-8">
//                       <div className="text-gray-500 dark:text-gray-400">
//                         {searchTerm
//                           ? "No entries found matching your search."
//                           : "No entries created yet."}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   currentEntries?.map((entry, i) => (
//                     <TableRow
//                       key={i}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                     >
//                       {/* Actions */}
//                       {currentUser?.role !== "admin" && (
//                         <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 router.push(`/entries/edit`);
//                                 setDataEntryId(entry?.id);
//                               }}
//                               className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleDelete(entry?.id)}
//                               className="hover:bg-red-50 hover:border-red-300 transition-colors"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       )}

//                       {currentUser?.role === "admin" && (
//                         <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => {
//                                 router.push(`/entries/edit`);
//                                 setDataEntryId(entry?.id);
//                               }}
//                               className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleDelete(entry?.id)}
//                               className="hover:bg-red-50 hover:border-red-300 transition-colors"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       )}

//                       {/* Personal Info */}
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.record_no}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.lead_no}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.applicant_first_name}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.applicant_last_name}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.street_address}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.city}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.zip_code}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.applicant_dob}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.co_applicant_first_name}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.co_applicant_last_name}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.best_time_to_call}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.personal_remark}
//                       </TableCell>

//                       {/* Asset Info */}
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.type_of_property}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.property_value}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.mortgage_type}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.loan_amount}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.loan_term}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.interest_type}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.monthly_installment}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.existing_loan}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.annual_income}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.down_payment}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.asset_remark}
//                       </TableCell>

//                       {/* Official Info */}
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.lender_name}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.loan_officer_first_name}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.loan_officer_last_name}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.tr_number}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.ni_number}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.occupation}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.other_income}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.credit_card_type}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.credit_score}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {entry?.official_remark}
//                       </TableCell>
//                       <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
//                         {moment(entry?.created_at).format("DD/MM/YYYY, h:mm a")}
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination Controls */}
//           {filteredEntries.length > 0 && (
//             <div className="flex items-center justify-between mt-6">
//               <div className="text-sm text-gray-600 dark:text-gray-400">
//                 Showing {startIndex + 1} to{" "}
//                 {Math.min(endIndex, filteredEntries.length)} of{" "}
//                 {filteredEntries.length} entries
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={goToPreviousPage}
//                   disabled={currentPage === 1}
//                   className="flex items-center bg-transparent"
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-1" />
//                   Previous
//                 </Button>

//                 <div className="flex items-center space-x-1">
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNumber;
//                     if (totalPages <= 5) {
//                       pageNumber = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNumber = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNumber = totalPages - 4 + i;
//                     } else {
//                       pageNumber = currentPage - 2 + i;
//                     }

//                     return (
//                       <Button
//                         key={pageNumber}
//                         variant={
//                           currentPage === pageNumber ? "default" : "outline"
//                         }
//                         size="sm"
//                         onClick={() => goToPage(pageNumber)}
//                         className="w-8 h-8 p-0"
//                       >
//                         {pageNumber}
//                       </Button>
//                     );
//                   })}
//                 </div>

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={goToNextPage}
//                   disabled={currentPage === totalPages}
//                   className="flex items-center bg-transparent"
//                 >
//                   Next
//                   <ChevronRight className="h-4 w-4 ml-1" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Search, X, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { deleteData } from "@/services/api"
import moment from "moment"
import { useDebounce } from "@/hooks/use-debounce"

export function DataEntryForm() {
  const {
    currentUser,
    dataEntries,
    deleteDataEntry,
    users,
    setDataEntryId,
    totalEntries,
    currentPage: storePage,
    itemsPerPage: storeItemsPerPage,
    fetchDataEntries,
  } = useAuthStore()

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true)
      fetchDataEntries(currentPage, itemsPerPage, debouncedSearchTerm).finally(() => {
        setIsLoading(false)
      })
    }
  }, [currentUser, currentPage, debouncedSearchTerm, fetchDataEntries, itemsPerPage])

  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1) // Reset to first page when searching
    }
  }, [debouncedSearchTerm, searchTerm])

  const clearSearch = () => {
    setSearchTerm("")
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || "Unknown User"
  }

  const handleDelete = async (entryId: number) => {
    try {
      const res = await deleteData(`delete/record/by/id/${entryId}`)

      if (res?.success) {
        deleteDataEntry(entryId.toString())
        fetchDataEntries(currentPage, itemsPerPage, debouncedSearchTerm)
        toast({
          title: "Entry deleted",
          description: "Data entry has been deleted successfully.",
        })
      }
    } catch (error) {
      const err = error as any

      toast({
        title: err?.message || "Error",
        description: "Failed to delete entry.",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil((totalEntries || 0) / itemsPerPage)

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(newPage)
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Entries ({totalEntries || 0})
              </CardTitle>

              <CardDescription className="text-gray-600 dark:text-gray-400">
                Manage your data entries ({totalEntries || 0} total entries)
              </CardDescription>
            </div>
            <Button
              onClick={() => router.push("/entries/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Search */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by record no"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {totalEntries || 0} total
            </Badge>
            {isLoading && (
              <Badge variant="outline" className="px-3 py-1">
                Loading...
              </Badge>
            )}
          </div>

          {/* Entries Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Actions</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Record No</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Lead ID</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Applicant First Name</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Applicant Last Name</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Street Address</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">City</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Zip Code</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Applicant DOB</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Co-Applicant First Name</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Co-Applicant Last Name</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Best Time to Call</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Personal Remark</TableHead>

                  {/* Asset Info */}
                  <TableHead className=" min-w-[200px] max-w-[300px]">Type of Property</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Property Value</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Mortgage Type</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Loan Amount</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Loan Term</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Interest Type</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Monthly Installment</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Existing Loan</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Annual Income</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Down Payment</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Asset Remark</TableHead>

                  {/* Official Info */}
                  <TableHead className=" min-w-[200px] max-w-[300px]">Lender Name</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Loan Officer First Name</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Loan Officer Last Name</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">T.R #</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">N.I #</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Occupation</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Other Income</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Credit Card Type</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Credit Score</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Official Remark</TableHead>
                  <TableHead className=" min-w-[200px] max-w-[300px]">Created Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {dataEntries?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={35} className="text-center py-8">
                      <div className="text-gray-500 dark:text-gray-400">
                        {isLoading
                          ? "Loading entries..."
                          : searchTerm
                            ? "No entries found matching your search."
                            : "No entries created yet."}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  dataEntries?.map((entry, i) => (
                    <TableRow key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      {/* Actions */}
                      {currentUser?.role !== "admin" && (
                        <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                router.push(`/entries/edit`)
                                setDataEntryId(entry?.id.toString())
                              }}
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(entry?.id)}
                              className="hover:bg-red-50 hover:border-red-300 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}

                      {currentUser?.role === "admin" && (
                        <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                router.push(`/entries/edit`)
                                setDataEntryId(entry?.id.toString())
                              }}
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(entry?.id)}
                              className="hover:bg-red-50 hover:border-red-300 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}

                      {/* Personal Info */}
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.record_no}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.lead_no}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.applicant_first_name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.applicant_last_name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.street_address}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.city}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.zip_code}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.applicant_dob}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.co_applicant_first_name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.co_applicant_last_name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.best_time_to_call}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.personal_remark}
                      </TableCell>

                      {/* Asset Info */}
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.type_of_property}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.property_value}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.mortgage_type}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.loan_amount}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.loan_term}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.interest_type}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.monthly_installment}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.existing_loan}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.annual_income}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.down_payment}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.asset_remark}
                      </TableCell>

                      {/* Official Info */}
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.lender_name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.loan_officer_first_name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.loan_officer_last_name}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.tr_number}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.ni_number}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.occupation}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.other_income}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.credit_card_type}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.credit_score}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {entry?.official_remark}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate overflow-hidden whitespace-nowrap w-48">
                        {moment(entry?.created_at).format("DD/MM/YYYY, h:mm a")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalEntries > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalEntries)}{" "}
                of {totalEntries} entries
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1 || isLoading}
                  className="flex items-center bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber
                    if (totalPages <= 5) {
                      pageNumber = i + 1
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i
                    } else {
                      pageNumber = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                        disabled={isLoading}
                        className="w-8 h-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || isLoading}
                  className="flex items-center bg-transparent"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
