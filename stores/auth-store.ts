// import { toast } from "@/hooks/use-toast";
// import { deleteData, getData, postData, updateData } from "@/services/api";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// // ---------- Interfaces ----------

// export interface User {
//   id: string;
//   name: string;
//   userName: string;
//   role: "superadmin" | "admin" | "user" | "";
//   createdBy?: string;
//   createdAt: string;
// }

// export interface DataEntry {
//   image: any;
//   id: string;
//   user_id: string;
//   admin_id: string;
//   record_no: string;
//   lead_no: string;
//   applicant_first_name: string;
//   applicant_last_name: string;
//   street_address: string;
//   city: string;
//   zip_code: string;
//   applicant_dob: string;
//   co_applicant_first_name: string;
//   co_applicant_last_name: string;
//   best_time_to_call: string;
//   personal_remark: string;
//   type_of_property: string;
//   property_value: string;
//   mortgage_type: string;
//   loan_amount: string;
//   loan_term: string;
//   interest_type: string;
//   monthly_installment: string;
//   existing_loan: string;
//   annual_income: string;
//   down_payment: string;
//   asset_remark: string;
//   lender_name: string;
//   loan_officer_first_name: string;
//   loan_officer_last_name: string;
//   tr_number: string;
//   ni_number: string;
//   occupation: string;
//   other_income: string;
//   credit_card_type: string;
//   credit_score: string;
//   official_remark: string;
//   created_at: string;
//   updated_at: string;
// }

// // ---------- Store Interface ----------

// interface AuthState {
//   currentUser: User | null;
//   token: string | null;
//   users: User[];
//   dataEntries: DataEntry[];
//   AdminData: any;
//   PortalLock: any;
//   DashboardData: any;

//   setUserAndToken: (user: User, token: string) => void;
//   login: (userName: string, password: string) => boolean;
//   logout: () => void;

//   // createUser: (userData: Omit<User, "id" | "createdAt">) => boolean;
//   // createUser: (userData: Omit<User, "id" | "createdAt">) => Promise<boolean>;
//   createUser: (
//     userData: Omit<User, "id" | "created_at"> & { password: string }
//   ) => Promise<boolean>;

//   updateUser: (id: string, userData: Partial<User>) => void;
//   deleteUser: (id: string) => void;

//   createDataEntry: (
//     entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
//   ) => void;
//   // updateDataEntry: (id: string, entryData: Partial<DataEntry>) => void;
//   deleteDataEntry: (id: string) => void;

//   getUsersByAdmin: (adminId: string) => User[];
//   getUsersByAdminApi: (adminId: string) => Promise<any>;

//   getDataEntriesByUser: (userId: string) => DataEntry[];

//   fetchDataEntries: () => Promise<void>;
//   updateDataEntry: (id: string, entryData: Partial<DataEntry>) => Promise<void>;
//   fetchAdminAndUser: () => Promise<void>;

//   fetchCountAdminAndUser: () => Promise<void>;
//   fetchLockStatus: () => Promise<void>;
// }

// // ---------- Store Setup ----------

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set, get) => ({
//       currentUser: null,
//       token: null,

//       users: [
//         {
//           id: "1",
//           name: "Super Admin",
//           userName: "super",
//           role: "superadmin",
//           createdAt: new Date().toISOString(),
//         },
//       ],

//       dataEntries: [],
//       AdminData: null, // ✅ <--- Add this line
//       DashboardData: null,
//       PortalLock: null,
//       setUserAndToken: (user, token) => set({ currentUser: user, token }),

//       login: (userName: string, password: string) => {
//         const user = get().users.find((u) => u.userName === userName);
//         if (user && password === "123") {
//           set({ currentUser: user, token: "demo-token" });
//           return true;
//         }
//         return false;
//       },

//       logout: () => {
//         set({ currentUser: null, token: null });
//       },

//       // createUser: (userData) => {
//       //   const { currentUser, users } = get();
//       //   if (!currentUser) return false;

//       //   if (currentUser.role === "superadmin") {
//       //     // Allowed
//       //   } else if (currentUser.role === "admin" && userData.role === "user") {
//       //     const adminUsers = users.filter(
//       //       (u) => u.createdBy === currentUser.id
//       //     );
//       //     if (adminUsers.length >= 5) return false;
//       //   } else {
//       //     return false;
//       //   }

//       //   const newUser: User = {
//       //     ...userData,
//       //     id: Date.now().toString(),
//       //     createdBy: currentUser.id,
//       //     createdAt: new Date().toISOString(),
//       //   };

//       //   set({ users: [...users, newUser] });
//       //   return true;
//       // },

//       createUser: async (userData) => {
//         const { currentUser, users } = get();
//         if (!currentUser) {
//           toast({
//             title: "Authentication required",
//             description: "You must be logged in to create users.",
//             variant: "destructive",
//           });
//           return false;
//         }

//         // Authorization
//         if (currentUser.role === "superadmin") {
//           // allowed
//         } else if (currentUser.role === "admin" && userData.role === "user") {
//           const adminUsers = users.filter(
//             (u) => u.createdBy === currentUser.id
//           );
//           if (adminUsers.length >= 5) {
//             toast({
//               title: "Limit reached",
//               description: "Admins can only create up to 5 users.",
//               variant: "destructive",
//             });
//             return false;
//           }
//         } else {
//           toast({
//             title: "Permission denied",
//             description: "You are not authorized to create this type of user.",
//             variant: "destructive",
//           });
//           return false;
//         }
//         console.log("userData: ", userData);
//         const payload = {
//           name: userData.name,
//           username: userData.userName,
//           password: userData.password,
//           role: userData.role,
//           created_by: currentUser?.role,
//           admin_id:
//             currentUser?.role === "superadmin"
//               ? currentUser?.id
//               : currentUser?.id,
//           user_limit: userData.user_limit,
//         };

//         try {
//           const response = await postData("/auth/register", payload);
//           console.log("response: ", response);

//           if (response?.success) {
//             toast({
//               title: "User created",
//               description: `User "${userData.name}" was created successfully.`,
//             });
//             await get().fetchAdminAndUser(); // Await to ensure users are fetched before filtering

//             return true;
//           } else {
//             return false;
//           }

//           // if (response?.success) {
//           //   const newUser: User = response.user;
//           //   set({ users: [...users, newUser] });

//           //   toast({
//           //     title: "User created",
//           //     description: `User "${newUser.name}" was created successfully.`,
//           //   });

//           //   return true;
//           // } else {
//           //   toast({
//           //     title: "Error",
//           //     description: "User creation failed. No user returned from API.",
//           //     variant: "destructive",
//           //   });
//           //   return false;
//           // }
//         } catch (error) {
//           console.error("Create user API error:", error);
//           toast({
//             title: "Server Error",
//             description: "Failed to create user due to server error.",
//             variant: "destructive",
//           });
//           return false;
//         }
//       },

//       updateUser: (id, userData) => {
//         set((state) => ({
//           users: state.users.map((user) =>
//             user.id === id ? { ...user, ...userData } : user
//           ),
//         }));
//       },

//       deleteUser: (id) => {
//         set((state) => ({
//           users: state.users.filter((user) => user.id !== id),
//         }));
//       },

//       createDataEntry: async (
//         entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
//       ) => {
//         console.log("entryData: ", entryData);
//         const useBackend = true;

//         // 🛠️ camelCase to snake_case converter
//         function camelToSnake<T extends Record<string, any>>(
//           obj: T
//         ): Record<string, any> {
//           const newObj: Record<string, any> = {};
//           for (const key in obj) {
//             if (Object.prototype.hasOwnProperty.call(obj, key)) {
//               const snakeKey = key.replace(
//                 /([A-Z])/g,
//                 (letter) => `_${letter.toLowerCase()}`
//               );
//               newObj[snakeKey] = obj[key];
//             }
//           }
//           return newObj;
//         }

//         if (!useBackend) {
//           const newEntry: DataEntry = {
//             ...entryData,
//             id: Date.now().toString(),
//             created_at: new Date().toISOString(),
//             updated_at: new Date().toISOString(),
//           };
//           set((state) => ({
//             dataEntries: [...state.dataEntries, newEntry],
//           }));
//           return { success: true };
//         }

//         //  API Mode
//         try {
//           const { dataEntries } = get();

//           // Convert to snake_case
//           const payload = camelToSnake(entryData);
//           console.log("payload:============= ", payload);

//           //  Replace with your actual postData helper
//           const response = await postData("/create/record", payload);

//           const newEntry: DataEntry = response.record;
//           set({ dataEntries: [...dataEntries, newEntry] });

//           return { success: true };
//         } catch (error) {
//           console.error("Create data entry error:", error);
//           return { success: false };
//         }
//       },

//       // updateDataEntrya: (id, entryData) => {
//       //   set((state) => ({
//       //     dataEntries: state.dataEntries.map((entry) =>
//       //       entry.id === id
//       //         ? { ...entry, ...entryData, updatedAt: new Date().toISOString() }
//       //         : entry
//       //     ),
//       //   }));
//       //   // update/record/by/id/:id
//       // },

//       updateDataEntry: async (id, entryData) => {
//         try {
//           const res = await postData(`update/record/by/id/${id}`, entryData);

//           console.log("Fetched entries: ", res?.record);
//           if (res?.result) {
//             toast({
//               title: "Entry updated",
//               description: "Data entry has been updated successfully.",
//             });

//             set((state) => ({
//               dataEntries: state.dataEntries.map((entry) =>
//                 entry.id === id
//                   ? {
//                       ...entry,
//                       ...entryData,
//                       updated_at: new Date().toISOString(),
//                     }
//                   : entry
//               ),
//             }));
//           }
//         } catch (error) {
//           console.error("Failed to update data entry:", error);
//           toast({
//             title: "Update failed",
//             description: "Server did not return updated record.",
//             variant: "destructive",
//           });
//         }
//       },

//       deleteDataEntry: (id) => {
//         set((state) => ({
//           dataEntries: state.dataEntries.filter((entry) => entry.id !== id),
//         }));
//       },

//       getUsersByAdmin: (adminId: string) => {
//         console.log("adminId: ", adminId);
//         return get().users.filter((user) => user?.createdBy === adminId);
//       },

//       getUsersByAdminApi: async (adminId: string) => {
//         console.log("adminId: ", adminId);
//         await get().fetchAdminAndUser(); // Await to ensure users are fetched before filtering
//         return get().users.filter((user) => user?.createdBy === adminId);
//       },

//       fetchAdminAndUser: async () => {
//         const { currentUser } = get();

//         if (!currentUser) return;

//         try {
//           let res;

//           if (currentUser.role === "superadmin") {
//             res = await getData(
//               `get/admin/user/by/role/id?role=${currentUser.role}`
//             );
//           }
//           if (currentUser.role === "admin") {
//             res = await getData(
//               `get/admin/user/by/role/id?role=${currentUser.role}&id=${currentUser.id}`
//             );
//           }

//           console.log("Fetched entries:======= ", res);

//           //  Set fetched users into state
//           if (res?.success && res?.user) {
//             set({ AdminData: res.user?.data });
//           }
//         } catch (error) {
//           console.error("Failed to fetch data entries:", error);
//         }
//       },

//       getDataEntriesByUser: (userId: string) => {
//         return get().dataEntries.filter((entry) => entry?.id === userId);
//       },

//       fetchDataEntries: async () => {
//         const { currentUser } = get();
//         // if (!currentUser || currentUser.role !== "superadmin") return;

//         console.log("currentUser.id: fetchDataEntries", currentUser?.id);
//         try {
//           const res = await getData(`get/all/records?id=${currentUser?.id}`);
//           console.log("Fetched entries: auth", res?.record);
//           if (res?.record) {
//             set({ dataEntries: res?.record });
//           }
//         } catch (error) {
//           console.error("Failed to fetch data entries:", error);
//         }
//       },

//       fetchCountAdminAndUser: async () => {
//         const { currentUser } = get();

//         if (!currentUser) return;

//         try {
//           let res;

//           if (currentUser.role === "superadmin")
//             res = await getData(`static/dashboard`);

//           if (currentUser.role === "admin")
//             res = await getData(`static/dashboard?admin_id=${currentUser.id}`);

//           if (currentUser.role === "user")
//             res = await getData(`static/dashboard?user_id=${currentUser.id}`);

//           console.log("Fetched entries:======= ", res);

//           //  Set fetched users into state
//           if (res?.success) {
//             set({ DashboardData: res });
//           }
//         } catch (error) {
//           console.error("Failed to fetch data entries:", error);
//         }
//       },

//       fetchLockStatus: async () => {
//         try {
//           const res = await getData(`lock-status`);
//           set({ PortalLock: res?.disabled });
//           return res?.disabled;
//         } catch (error) {
//           console.error("Failed to fetch data entries:", error);
//         }
//       },
//     }),
//     {
//       name: "auth-storage",
//     }
//   )
// );

// =============================

// import { toast } from "@/hooks/use-toast";
// import { deleteData, getData, postData, updateData } from "@/services/api";
// import { create } from "zustand";

// // ---------- Interfaces ----------

// export interface User {
//   id: string;
//   name: string;
//   userName: string;
//   role: "superadmin" | "admin" | "user" | "";
//   createdBy?: string;
//   createdAt: string;
// }

// export interface DataEntry {
//   image: any;
//   id: string;
//   user_id: string;
//   admin_id: string;
//   record_no: string;
//   lead_no: string;
//   applicant_first_name: string;
//   applicant_last_name: string;
//   street_address: string;
//   city: string;
//   zip_code: string;
//   applicant_dob: string;
//   co_applicant_first_name: string;
//   co_applicant_last_name: string;
//   best_time_to_call: string;
//   personal_remark: string;
//   type_of_property: string;
//   property_value: string;
//   mortgage_type: string;
//   loan_amount: string;
//   loan_term: string;
//   interest_type: string;
//   monthly_installment: string;
//   existing_loan: string;
//   annual_income: string;
//   down_payment: string;
//   asset_remark: string;
//   lender_name: string;
//   loan_officer_first_name: string;
//   loan_officer_last_name: string;
//   tr_number: string;
//   ni_number: string;
//   occupation: string;
//   other_income: string;
//   credit_card_type: string;
//   credit_score: string;
//   official_remark: string;
//   created_at: string;
//   updated_at: string;
// }

// ---------- Store Interface ----------

// interface AuthState {
//   currentUser: User | null;
//   token: string | null;
//   users: User[];
//   dataEntries: DataEntry[];
//   AdminData: any;
//   PortalLock: any;
//   DashboardData: any;

//   setUserAndToken: (user: User, token: string) => void;
//   login: (userName: string, password: string) => boolean;
//   logout: () => void;

//   createUser: (
//     userData: Omit<User, "id" | "created_at"> & { password: string }
//   ) => Promise<boolean>;

//   updateUser: (id: string, userData: Partial<User>) => void;
//   deleteUser: (id: string) => void;

//   createDataEntry: (
//     entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
//   ) => void;

//   deleteDataEntry: (id: string) => void;

//   getUsersByAdmin: (adminId: string) => User[];
//   getUsersByAdminApi: (adminId: string) => Promise<any>;

//   getDataEntriesByUser: (userId: string) => DataEntry[];

//   fetchDataEntries: () => Promise<void>;
//   updateDataEntry: (id: string, entryData: Partial<DataEntry>) => Promise<void>;
//   fetchAdminAndUser: () => Promise<void>;

//   fetchCountAdminAndUser: () => Promise<void>;
//   fetchLockStatus: () => Promise<void>;
// }

// // ---------- Store Setup Without `persist` ----------

// export const useAuthStore = create<AuthState>((set, get) => ({
//   currentUser: null,
//   token: null,

//   users: [
//     {
//       id: "1",
//       name: "Super Admin",
//       userName: "super",
//       role: "superadmin",
//       createdAt: new Date().toISOString(),
//     },
//   ],

//   dataEntries: [],
//   AdminData: null,
//   DashboardData: null,
//   PortalLock: null,

//   setUserAndToken: (user, token) => set({ currentUser: user, token }),

//   login: (userName: string, password: string) => {
//     const user = get().users.find((u) => u.userName === userName);
//     if (user && password === "123") {
//       set({ currentUser: user, token: "demo-token" });
//       return true;
//     }
//     return false;
//   },

//   logout: () => {
//     set({ currentUser: null, token: null });
//   },

//   createUser: async (userData) => {
//     const { currentUser, users } = get();
//     if (!currentUser) {
//       toast({
//         title: "Authentication required",
//         description: "You must be logged in to create users.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     if (currentUser.role === "superadmin") {
//       // allowed
//     } else if (currentUser.role === "admin" && userData.role === "user") {
//       const adminUsers = users.filter((u) => u.createdBy === currentUser.id);
//       if (adminUsers.length >= 5) {
//         toast({
//           title: "Limit reached",
//           description: "Admins can only create up to 5 users.",
//           variant: "destructive",
//         });
//         return false;
//       }
//     } else {
//       toast({
//         title: "Permission denied",
//         description: "You are not authorized to create this type of user.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     const payload = {
//       name: userData.name,
//       username: userData.userName,
//       password: userData.password,
//       role: userData.role,
//       created_by: currentUser?.role,
//       admin_id: currentUser?.id,
//       user_limit: userData.user_limit,
//     };

//     try {
//       const response = await postData("/auth/register", payload);
//       if (response?.success) {
//         toast({
//           title: "User created",
//           description: `User "${userData.name}" was created successfully.`,
//         });
//         await get().fetchAdminAndUser();
//         return true;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       console.error("Create user API error:", error);
//       toast({
//         title: "Server Error",
//         description: "Failed to create user due to server error.",
//         variant: "destructive",
//       });
//       return false;
//     }
//   },

//   updateUser: (id, userData) => {
//     set((state) => ({
//       users: state.users.map((user) =>
//         user.id === id ? { ...user, ...userData } : user
//       ),
//     }));
//   },

//   deleteUser: (id) => {
//     set((state) => ({
//       users: state.users.filter((user) => user.id !== id),
//     }));
//   },

//   createDataEntry: async (
//     entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
//   ) => {
//     function camelToSnake<T extends Record<string, any>>(
//       obj: T
//     ): Record<string, any> {
//       const newObj: Record<string, any> = {};
//       for (const key in obj) {
//         if (Object.prototype.hasOwnProperty.call(obj, key)) {
//           const snakeKey = key.replace(
//             /([A-Z])/g,
//             (letter) => `_${letter.toLowerCase()}`
//           );
//           newObj[snakeKey] = obj[key];
//         }
//       }
//       return newObj;
//     }

//     try {
//       const { dataEntries } = get();
//       const payload = camelToSnake(entryData);
//       const response = await postData("/create/record", payload);
//       const newEntry: DataEntry = response.record;
//       set({ dataEntries: [...dataEntries, newEntry] });
//       return { success: true };
//     } catch (error) {
//       console.error("Create data entry error:", error);
//       return { success: false };
//     }
//   },

//   updateDataEntry: async (id, entryData) => {
//     try {
//       const res = await postData(`update/record/by/id/${id}`, entryData);
//       if (res?.result) {
//         toast({
//           title: "Entry updated",
//           description: "Data entry has been updated successfully.",
//         });

//         set((state) => ({
//           dataEntries: state.dataEntries.map((entry) =>
//             entry.id === id
//               ? { ...entry, ...entryData, updated_at: new Date().toISOString() }
//               : entry
//           ),
//         }));
//       }
//     } catch (error) {
//       console.error("Failed to update data entry:", error);
//       toast({
//         title: "Update failed",
//         description: "Server did not return updated record.",
//         variant: "destructive",
//       });
//     }
//   },

//   deleteDataEntry: (id) => {
//     set((state) => ({
//       dataEntries: state.dataEntries.filter((entry) => entry.id !== id),
//     }));
//   },

//   getUsersByAdmin: (adminId: string) => {
//     return get().users.filter((user) => user?.createdBy === adminId);
//   },

//   getUsersByAdminApi: async (adminId: string) => {
//     await get().fetchAdminAndUser();
//     return get().users.filter((user) => user?.createdBy === adminId);
//   },

//   getDataEntriesByUser: (userId: string) => {
//     return get().dataEntries.filter((entry) => entry?.id === userId);
//   },

//   fetchDataEntries: async () => {
//     const { currentUser } = get();
//     try {
//       const res = await getData(`get/all/records?id=${currentUser?.id}`);
//       if (res?.record) {
//         set({ dataEntries: res?.record });
//       }
//     } catch (error) {
//       console.error("Failed to fetch data entries:", error);
//     }
//   },

//   fetchAdminAndUser: async () => {
//     const { currentUser } = get();
//     if (!currentUser) return;

//     try {
//       let res;
//       if (currentUser.role === "superadmin") {
//         res = await getData(
//           `get/admin/user/by/role/id?role=${currentUser.role}`
//         );
//       } else if (currentUser.role === "admin") {
//         res = await getData(
//           `get/admin/user/by/role/id?role=${currentUser.role}&id=${currentUser.id}`
//         );
//       }

//       if (res?.success && res?.user) {
//         set({ AdminData: res.user?.data });
//       }
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     }
//   },

//   fetchCountAdminAndUser: async () => {
//     const { currentUser } = get();
//     if (!currentUser) return;

//     try {
//       let res;
//       if (currentUser.role === "superadmin")
//         res = await getData(`static/dashboard`);
//       else if (currentUser.role === "admin")
//         res = await getData(`static/dashboard?admin_id=${currentUser.id}`);
//       else if (currentUser.role === "user")
//         res = await getData(`static/dashboard?user_id=${currentUser.id}`);

//       if (res?.success) {
//         set({ DashboardData: res });
//       }
//     } catch (error) {
//       console.error("Failed to fetch dashboard data:", error);
//     }
//   },

//   fetchLockStatus: async () => {
//     try {
//       const res = await getData(`lock-status`);
//       set({ PortalLock: res?.disabled });
//       return res?.disabled;
//     } catch (error) {
//       console.error("Failed to fetch lock status:", error);
//     }
//   },
// }));

// =================================

import { toast } from "@/hooks/use-toast";
import { deleteData, getData, postData, updateData } from "@/services/api";
import { create } from "zustand";

// ---------- Interfaces ----------

export interface User {
  id: string;
  name: string;
  userName: string;
  user_limit: null;
  role: "superadmin" | "admin" | "user" | "";
  createdBy?: string;
  createdAt: string;
}

export interface DataEntry {
  image: any;
  id: string;
  user_id: string;
  admin_id: string;
  record_no: string;
  lead_no: string;
  applicant_first_name: string;
  applicant_last_name: string;
  street_address: string;
  city: string;
  zip_code: string;
  applicant_dob: string;
  co_applicant_first_name: string;
  co_applicant_last_name: string;
  best_time_to_call: string;
  personal_remark: string;
  type_of_property: string;
  property_value: string;
  mortgage_type: string;
  loan_amount: string;
  loan_term: string;
  interest_type: string;
  monthly_installment: string;
  existing_loan: string;
  annual_income: string;
  down_payment: string;
  asset_remark: string;
  lender_name: string;
  loan_officer_first_name: string;
  loan_officer_last_name: string;
  tr_number: string;
  ni_number: string;
  occupation: string;
  other_income: string;
  credit_card_type: string;
  credit_score: string;
  official_remark: string;
  created_at: string;
  updated_at: string;
}

// ---------- Store Interface ----------

interface AuthState {
  currentUser: User | null;
  token: string | null;
  users: User[];
  session: string | null; // Added session to store
  // session: string | null; // Added session to store
  dataEntries: DataEntry[];
  AdminData: any;
  PortalLock: any;
  DashboardData: any;
  entryId: any;

  restoreSession: () => void;

  setUserAndToken: (user: User, token: string, session: string) => void;
  login: (userName: string, password: string) => boolean;
  logout: () => void;

  createUser: (
    userData: Omit<User, "id" | "created_at"> & { password: string }
  ) => Promise<boolean>;

  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;

  createDataEntry: (
    entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
  ) => Promise<{ success: boolean }>;
  updateDataEntry: (id: string, entryData: Partial<DataEntry>) => Promise<void>;
  deleteDataEntry: (id: string) => void;

  getUsersByAdmin: (adminId: string) => User[];
  getUsersByAdminApi: (adminId: string) => Promise<any>;

  getDataEntriesByUser: (userId: string) => DataEntry[];

  fetchDataEntries: () => Promise<void>;
  fetchAdminAndUser: () => Promise<void>;

  fetchCountAdminAndUser: () => Promise<void>;
  fetchLockStatus: () => Promise<void>;

  setToken: (token: string | null) => void;

  setCurrentUser: (user: User | null) => void;
  setDataEntryId: (id: string) => void;
}

// ---------- Store Setup ----------

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  token: null,
  users: [],
  dataEntries: [],
  AdminData: null,
  DashboardData: null,
  PortalLock: null,
  session: null,
  entryId: null,

  setUserAndToken: (user, token, session) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("session", session);
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    set({ currentUser: user, token, session });
  },

  restoreSession: () => {
    const token = sessionStorage.getItem("token");
    const session = sessionStorage.getItem("session");
    const userStr = sessionStorage.getItem("currentUser");

    if (token && userStr && session) {
      const user = JSON.parse(userStr);
      set({ token, currentUser: user, session });
    }
  },

  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("session");
    sessionStorage.removeItem("currentUser");
    set({ currentUser: null, token: null });
  },

  setToken: (token) => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
    set({ token });
  },

  setDataEntryId: (id) => set({ entryId: id }),
  setCurrentUser: (user) => set({ currentUser: user }),

  // setUserAndToken: (user, token) => {
  //   get().setCurrentUser(user);
  //   get().setToken(token);
  // },

  login: (userName: string, password: string) => {
    const user = get().users.find((u) => u.userName === userName);
    if (user && password === "123") {
      get().setUserAndToken(user, "demo-token", "demo-session");
      return true;
    }
    return false;
  },

  // logout: () => {
  //   get().setToken(null);
  //   set({ currentUser: null });
  // },

  createUser: async (userData) => {
    const { currentUser, users } = get();
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create users.",
        variant: "destructive",
      });
      return false;
    }

    if (currentUser.role === "superadmin") {
      // allowed
    } else if (currentUser.role === "admin" && userData.role === "user") {
      const adminUsers = users.filter((u) => u.createdBy === currentUser.id);
      if (adminUsers.length >= 5) {
        toast({
          title: "Limit reached",
          description: "Admins can only create up to 5 users.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      toast({
        title: "Permission denied",
        description: "You are not authorized to create this type of user.",
        variant: "destructive",
      });
      return false;
    }

    const payload = {
      name: userData.name,
      username: userData.userName,
      password: userData.password,
      role: userData.role,
      created_by: currentUser?.role,
      admin_id:
        currentUser?.role === "superadmin" ? currentUser?.id : currentUser?.id,
      user_limit: userData.user_limit,
    };

    try {
      const response = await postData("/auth/register", payload);
      if (response?.success) {
        toast({
          title: "User created",
          description: `User "${userData.name}" was created successfully.`,
        });
        await get().fetchAdminAndUser(); // refresh user list
        return true;
      }
      return false;
    } catch (error) {
      console.error("Create user API error:", error);
      const err = error as any;
      toast({
        title: "Failed to create user",
        description:
          err?.response?.data?.message ||
          "Failed to create user due to server error.",
        variant: "destructive",
      });
      return false;
    }
  },

  updateUser: (id, userData) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      ),
    }));
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
  },

  createDataEntry: async (entryData) => {
    const useBackend = true;

    function camelToSnake<T extends Record<string, any>>(
      obj: T
    ): Record<string, any> {
      const newObj: Record<string, any> = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const snakeKey = key.replace(
            /([A-Z])/g,
            (letter) => `_${letter.toLowerCase()}`
          );
          newObj[snakeKey] = obj[key];
        }
      }
      return newObj;
    }

    if (!useBackend) {
      const newEntry: DataEntry = {
        ...entryData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set((state) => ({
        dataEntries: [...state.dataEntries, newEntry],
      }));
      return { success: true };
    }

    try {
      const { dataEntries } = get();
      const payload = camelToSnake(entryData);
      const response = await postData("/create/record", payload);

      const newEntry: DataEntry = response.record;
      set({ dataEntries: [...dataEntries, newEntry] });

      return { success: true };
    } catch (error) {
      console.error("Create data entry error:", error);
      return { success: false };
    }
  },

  updateDataEntry: async (id, entryData) => {
    try {
      const res = await postData(`update/record/by/id/${id}`, entryData);
      if (res?.result) {
        toast({
          title: "Entry updated",
          description: "Data entry has been updated successfully.",
        });

        set((state) => ({
          dataEntries: state.dataEntries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  ...entryData,
                  updated_at: new Date().toISOString(),
                }
              : entry
          ),
        }));
        return res;
      }
    } catch (error) {
      console.error("Failed to update data entry:", error);
      toast({
        title: "Update failed",
        description: "Server did not return updated record.",
        variant: "destructive",
      });
    }
  },

  deleteDataEntry: (id) => {
    set((state) => ({
      dataEntries: state.dataEntries.filter((entry) => entry.id !== id),
    }));
  },

  getUsersByAdmin: (adminId) => {
    return get().users.filter((user) => user?.createdBy === adminId);
  },

  getUsersByAdminApi: async (adminId) => {
    await get().fetchAdminAndUser();
    return get().users.filter((user) => user?.createdBy === adminId);
  },

  fetchAdminAndUser: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      let res;
      if (currentUser.role === "superadmin") {
        res = await getData(
          `get/admin/user/by/role/id?role=${currentUser.role}`
        );
      } else if (currentUser.role === "admin") {
        res = await getData(
          `get/admin/user/by/role/id?role=${currentUser.role}&id=${currentUser.id}`
        );
      }

      if (res?.success) {
        set({ AdminData: res?.user?.data });
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },

  getDataEntriesByUser: (userId) => {
    return get().dataEntries.filter((entry) => entry?.id === userId);
  },

  fetchDataEntries: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      const res = await getData(
        `get/all/records?id=${currentUser?.id}&role=${currentUser?.role}`
      );
      if (res?.record) {
        set({ dataEntries: res?.record });
      }
    } catch (error) {
      console.error("Failed to fetch data entries:", error);
    }
  },

  fetchCountAdminAndUser: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      let res;
      if (currentUser.role === "superadmin")
        res = await getData(`static/dashboard`);
      else if (currentUser.role === "admin")
        res = await getData(`static/dashboard?admin_id=${currentUser.id}`);
      else if (currentUser.role === "user")
        res = await getData(`static/dashboard?user_id=${currentUser.id}`);

      if (res?.success) {
        set({ DashboardData: res });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  },

  fetchLockStatus: async () => {
    try {
      const res = await getData(`lock-status`);
      set({ PortalLock: res?.disabled });
      return res?.disabled;
    } catch (error) {
      console.error("Failed to fetch lock status:", error);
    }
  },

  // restoreUserFromToken: async () => {
  // const token = sessionStorage.getItem("token");
  // if (!token) return;

  // try {
  //   // const res = await getData("/me", { headers: { Authorization: `Bearer ${token}` } });
  //   if (token) {
  //     useAuthStore.getState().setCurrentUser(res.user);
  //     useAuthStore.getState().setToken(token);
  //   }
  // } catch (err) {
  //   console.error("Failed to restore user session", err);
  //   useAuthStore.getState().logout();
  // }
  // }
}));
