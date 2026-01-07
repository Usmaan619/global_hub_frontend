// // =================================

// import { toast } from "@/hooks/use-toast";
// import { deleteData, getData, postData, updateData } from "@/services/api";
// import { create } from "zustand";

// // ---------- Interfaces ----------

// export interface User {
//   id: string;
//   name: string;
//   userName: string;
//   user_limit: null;
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
//   session: string | null; // Added session to store
//   // session: string | null; // Added session to store
//   dataEntries: DataEntry[];
//   AdminData: any;
//   PortalLock: any;
//   DashboardData: any;
//   entryId: any;
//   totalEntries: any;
//   currentPage: any;
//   itemsPerPage: any;

//   restoreSession: () => void;

//   setUserAndToken: (user: User, token: string, session: string) => void;
//   login: (userName: string, password: string) => boolean;
//   logout: () => void;

//   createUser: (
//     userData: Omit<User, "id" | "created_at"> & { password: string }
//   ) => Promise<boolean>;

//   updateUser: (id: string, userData: Partial<User>) => void;
//   deleteUser: (id: string) => void;

//   createDataEntry: (
//     entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
//   ) => Promise<{ success: boolean }>;
//   updateDataEntry: (id: string, entryData: Partial<DataEntry>) => Promise<void>;
//   deleteDataEntry: (id: string) => void;

//   getUsersByAdmin: (adminId: string) => User[];
//   getUsersByAdminApi: (adminId: string) => Promise<any>;

//   getDataEntriesByUser: (userId: string) => DataEntry[];

//   // fetchDataEntries: () => Promise<void>;
//   fetchDataEntries: (
//     page?: number,
//     limit?: number,
//     search?: string
//   ) => Promise<void>;
//   fetchAdminAndUser: () => Promise<void>;

//   fetchCountAdminAndUser: () => Promise<void>;
//   fetchLockStatus: () => Promise<void>;

//   setToken: (token: string | null) => void;

//   setCurrentUser: (user: User | null) => void;
//   setDataEntryId: (id: string) => void;
// }

// // ---------- Store Setup ----------

// export const useAuthStore = create<AuthState>((set, get) => ({
//   currentUser: null,
//   token: null,
//   users: [],
//   dataEntries: [],
//   AdminData: null,
//   DashboardData: null,
//   PortalLock: null,
//   session: null,
//   entryId: null,
//   totalEntries: 0,
//   currentPage: 1,
//   itemsPerPage: 10,

//   setUserAndToken: (user, token, session) => {
//     sessionStorage.setItem("token", token);
//     sessionStorage.setItem("session", session);
//     sessionStorage.setItem("currentUser", JSON.stringify(user));
//     set({ currentUser: user, token, session });
//   },

//   restoreSession: () => {
//     const token = sessionStorage.getItem("token");
//     const session = sessionStorage.getItem("session");
//     const userStr = sessionStorage.getItem("currentUser");

//     if (token && userStr && session) {
//       const user = JSON.parse(userStr);
//       set({ token, currentUser: user, session });
//     }
//   },

//   logout: () => {
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("session");
//     sessionStorage.removeItem("currentUser");
//     set({ currentUser: null, token: null });
//   },

//   setToken: (token) => {
//     if (token) {
//       sessionStorage.setItem("token", token);
//     } else {
//       sessionStorage.removeItem("token");
//     }
//     set({ token });
//   },

//   setDataEntryId: (id) => set({ entryId: id }),
//   setCurrentUser: (user) => set({ currentUser: user }),

//   // setUserAndToken: (user, token) => {
//   //   get().setCurrentUser(user);
//   //   get().setToken(token);
//   // },

//   login: (userName: string, password: string) => {
//     const user = get().users.find((u) => u.userName === userName);
//     if (user && password === "123") {
//       get().setUserAndToken(user, "demo-token", "demo-session");
//       return true;
//     }
//     return false;
//   },

//   // logout: () => {
//   //   get().setToken(null);
//   //   set({ currentUser: null });
//   // },

//   createUser: async (userData) => {
//     const { currentUser, users } = get();
//     const res = await get().fetchLockStatus();

//     if (currentUser?.role !== "superadmin" && res) {
//       get().logout();
//       window.location.href = "/";
//       toast({
//         title: "Portal Locked",
//         description: "Access is currently restricted. Please try again later.",
//         variant: "destructive",
//       });
//       return;
//     }
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
//       admin_id:
//         currentUser?.role === "superadmin" ? currentUser?.id : currentUser?.id,
//       user_limit: userData.user_limit,
//     };

//     try {
//       const response = await postData("/auth/register", payload);
//       if (response?.success) {
//         toast({
//           title: "User created",
//           description: `User "${userData.name}" was created successfully.`,
//         });
//         await get().fetchAdminAndUser(); // refresh user list
//         return true;
//       }
//       return false;
//     } catch (error) {
//       const err = error as any;
//       console.log("err: ", err);
//       toast({
//         title: err?.message || "Failed to create user",
//         description: "Failed to create user",
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

//   createDataEntry: async (entryData) => {
//     const res = await get().fetchLockStatus();
//     const { currentUser } = get();

//     if (currentUser?.role !== "superadmin" && res) {
//       get().logout();
//       window.location.href = "/";
//       toast({
//         title: "Portal Locked",
//         description: "Access is currently restricted. Please try again later.",
//         variant: "destructive",
//       });
//       return;
//     }
//     const useBackend = true;

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

//     if (!useBackend) {
//       const newEntry: DataEntry = {
//         ...entryData,
//         id: Date.now().toString(),
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       };
//       set((state) => ({
//         dataEntries: [...state.dataEntries, newEntry],
//       }));
//       return { success: true };
//     }

//     try {
//       const { dataEntries } = get();
//       const payload = camelToSnake(entryData);
//       const response = await postData("/create/record", payload);

//       const newEntry: DataEntry = response.record;
//       set({ dataEntries: [...dataEntries, newEntry] });

//       return { success: true };
//     } catch (error) {
//       return { success: false };
//     }
//   },

//   updateDataEntry: async (id, entryData) => {
//     const res = await get().fetchLockStatus();
//     const { currentUser } = get();

//     if (currentUser?.role !== "superadmin" && res) {
//       get().logout();
//       window.location.href = "/";
//       toast({
//         title: "Portal Locked",
//         description: "Access is currently restricted. Please try again later.",
//         variant: "destructive",
//       });
//       return;
//     }
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
//               ? {
//                   ...entry,
//                   ...entryData,
//                   updated_at: new Date().toISOString(),
//                 }
//               : entry
//           ),
//         }));
//         return res;
//       }
//     } catch (error) {
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

//   getUsersByAdmin: (adminId) => {
//     return get().users.filter((user) => user?.createdBy === adminId);
//   },

//   getUsersByAdminApi: async (adminId) => {
//     await get().fetchAdminAndUser();
//     return get().users.filter((user) => user?.createdBy === adminId);
//   },

//   fetchAdminAndUser: async () => {
//     const { currentUser } = get();
//     if (!currentUser) return;
//     const res = await get().fetchLockStatus();
//     if (currentUser?.role !== "superadmin" && res) {
//       get().logout();
//       window.location.href = "/";
//       toast({
//         title: "Portal Locked",
//         description: "Access is currently restricted. Please try again later.",
//         variant: "destructive",
//       });
//       return;
//     }
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

//       if (res?.success) {
//         set({ AdminData: res?.user?.data });
//       }
//     } catch (error) {}
//   },

//   getDataEntriesByUser: (userId) => {
//     return get().dataEntries.filter((entry) => entry?.id === userId);
//   },

//   // fetchDataEntries: async () => {
//   //   const { currentUser } = get();
//   //   const res = await get().fetchLockStatus();
//   //   if (currentUser?.role !== "superadmin" && res) {
//   //     get().logout();
//   //     window.location.href = "/";
//   //     toast({
//   //       title: "Portal Locked",
//   //       description: "Access is currently restricted. Please try again later.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }
//   //   if (!currentUser) return;

//   //   try {
//   //     const res = await getData(
//   //       `get/all/records?id=${currentUser?.id}&role=${currentUser?.role}`
//   //     );
//   //     if (res?.record) {
//   //       set({ dataEntries: res?.record });
//   //     }
//   //   } catch (error) {}
//   // },
//   fetchDataEntries: async (page = 1, limit = 10, search = "") => {
//     const { currentUser } = get();

//     // Check for portal lock
//     const lockRes = await get().fetchLockStatus();
//     if (currentUser?.role !== "superadmin" && lockRes) {
//       get().logout();
//       window.location.href = "/";
//       toast({
//         title: "Portal Locked",
//         description: "Access is currently restricted. Please try again later.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!currentUser) return;

//     try {
//       const res = await getData(
//         `get/all/records?id=${currentUser?.id}&role=${currentUser?.role}&page=${page}&limit=${limit}&search=${search}`
//       );
//       console.log('res:====== ', res);

//       if (res?.record) {
//         set({
//           dataEntries: res?.record?.data,
//           totalEntries: res?.record?.total, // <- Add this to your Zustand state
//           currentPage: res?.record?.page,
//           itemsPerPage: res?.record?.limit,
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching paginated records:", error);
//     }
//   },

//   fetchCountAdminAndUser: async () => {
//     const { currentUser } = get();
//     if (!currentUser) return;
//     const res = await get().fetchLockStatus();
//     if (currentUser?.role !== "superadmin" && res) {
//       get().logout();

//       window.location.href = "/";
//       toast({
//         title: "Portal Locked",
//         description: "Access is currently restricted. Please try again later.",
//         variant: "destructive",
//       });
//       return;
//     }
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
//     } catch (error) {}
//   },

//   fetchLockStatus: async () => {
//     try {
//       const res = await getData(`lock-status`);
//       set({ PortalLock: res?.disabled });
//       return res?.disabled;
//     } catch (error) {}
//   },

//   // restoreUserFromToken: async () => {
//   // const token = sessionStorage.getItem("token");
//   // if (!token) return;

//   // try {
//   //   // const res = await getData("/me", { headers: { Authorization: `Bearer ${token}` } });
//   //   if (token) {
//   //     useAuthStore.getState().setCurrentUser(res.user);
//   //     useAuthStore.getState().setToken(token);
//   //   }
//   // } catch (err) {
//   //
//   //   useAuthStore.getState().logout();
//   // }
//   // }
// }));

// =================================

import { toast } from "@/hooks/use-toast";
import { getData, postData } from "@/services/api";
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
  id: number;
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

export interface PaginatedApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
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
  totalEntries: any;
  currentPage: any;
  itemsPerPage: any;

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
  ) => Promise<any>;
  updateDataEntry: (id: string, entryData: Partial<DataEntry>) => Promise<void>;
  deleteDataEntry: (id: string) => void;

  getUsersByAdmin: (adminId: string) => User[];
  getUsersByAdminApi: (adminId: string) => Promise<any>;

  getDataEntriesByUser: (userId: string) => DataEntry[];

  fetchDataEntries: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
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
  totalEntries: 0,
  currentPage: 1,
  itemsPerPage: 10,

  setUserAndToken: (user, token, session) => {
    console.log("user, token, session:setUserAndToken ", user, token, session);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("session", session);
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    set({ currentUser: user, token, session });
  },

  restoreSession: () => {
    const token = sessionStorage.getItem("token");
    const session = sessionStorage.getItem("session");
    const userStr = sessionStorage.getItem("currentUser");

    console.log(
      "token && userStr && session:restoreSession ",
      token && userStr && session
    );
    if (token && userStr && session) {
      const user = JSON.parse(userStr);
      set({ token, currentUser: user, session });
    }
  },

  logout: () => {
    console.log("logout");
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

  login: (userName: string, password: string) => {
    const user = get().users.find((u) => u.userName === userName);
    if (user && password === "123") {
      get().setUserAndToken(user, "demo-token", "demo-session");
      return true;
    }
    return false;
  },

  createUser: async (userData) => {
    const { currentUser, users } = get();
    const res = await get().fetchLockStatus();

    if (currentUser?.role !== "superadmin" && res) {
      get().logout();
      window.location.href = "/";
      toast({
        title: "Portal Locked",
        description: "Access is currently restricted. Please try again later.",
        variant: "destructive",
      });
      return;
    }
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
      console.log("userData: ", userData);
      const adminUsers = users.filter((u) => u.createdBy === currentUser.id);
      console.log("adminUsers: ", adminUsers);
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
      const err = error as any;
      console.log("err: ", err);
      toast({
        title: err?.message || "Failed to create user",
        description: "Failed to create user",
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
    const res = await get().fetchLockStatus();
    const { currentUser } = get();

    if (currentUser?.role !== "superadmin" && res) {
      get().logout();
      window.location.href = "/";
      toast({
        title: "Portal Locked",
        description: "Access is currently restricted. Please try again later.",
        variant: "destructive",
      });
      return;
    }
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
      console.log("error:-----------success: false------------------ ", error);

      if (
        error?.success === false &&
        error?.message === "reCAPTCHA verification failed"
      ) {
        toast({
          title: "Warning",
          description:
            "If you are using an autotyper, all your entries may be deleted. You will be fully responsible for this action.",
          variant: "destructive",
        });
      }
      return { success: false };
    }
  },

  updateDataEntry: async (id, entryData) => {
    const res = await get().fetchLockStatus();
    const { currentUser } = get();

    if (currentUser?.role !== "superadmin" && res) {
      get().logout();
      window.location.href = "/";
      toast({
        title: "Portal Locked",
        description: "Access is currently restricted. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await postData(`update/record/by/id/${id}`, entryData);
      if (res?.result) {
        toast({
          title: "Entry updated",
          description: "Data entry has been updated successfully.",
        });

        set((state) => ({
          dataEntries: state.dataEntries.map((entry) =>
            entry?.id === id
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
      toast({
        title: "Update failed",
        description: "Server did not return updated record.",
        variant: "destructive",
      });
    }
  },

  deleteDataEntry: (id) => {
    set((state) => ({
      dataEntries: state.dataEntries.filter((entry) => entry?.id !== id),
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
    const res = await get().fetchLockStatus();
    if (currentUser?.role !== "superadmin" && res) {
      get().logout();
      window.location.href = "/";
      toast({
        title: "Portal Locked",
        description: "Access is currently restricted. Please try again later.",
        variant: "destructive",
      });
      return;
    }
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
    } catch (error) {}
  },

  getDataEntriesByUser: (userId) => {
    return get().dataEntries.filter((entry) => entry?.id === userId);
  },
  fetchDataEntries: async (
  page = 1,
  limit = 10,
  search = "",
  userId = "all"
) => {
  const { currentUser } = get();
  if (!currentUser) return;

  const lockRes = await get().fetchLockStatus();
  if (currentUser.role !== "superadmin" && lockRes) {
    get().logout();
    window.location.href = "/";
    toast({
      title: "Portal Locked",
      description: "Access is currently restricted.",
      variant: "destructive",
    });
    return;
  }

  try {
    const params = new URLSearchParams({
      role: currentUser.role,
      page: String(page),
      limit: String(limit),
    });

    // 🔑 ADMIN LOGIC (FINAL)
    if (currentUser.role === "admin") {
      params.set("id", currentUser.id);     // ✅ adminId
      params.set("scope", userId || "all"); // ✅ all | userId
    } else {
      params.set("id", currentUser.id);     // user / superadmin
    }

    if (search) params.set("search", search);

    const res: any = await getData(
      `get/all/records?${params.toString()}`
    );

    if (res?.record) {
      set({
        dataEntries: res.record.data,
        totalEntries: res.record.total,
        currentPage: res.record.page,
        itemsPerPage: res.record.limit,
      });
    }
  } catch (err) {
    toast({
      title: "Error",
      description: "Failed to fetch data entries",
      variant: "destructive",
    });
  }
},


  // fetchDataEntries: async (page = 1, limit = 10, search = "") => {
  //   const { currentUser } = get();

  //   // Check for portal lock
  //   const lockRes = await get().fetchLockStatus();
  //   if (currentUser?.role !== "superadmin" && lockRes) {
  //     get().logout();
  //     window.location.href = "/";
  //     toast({
  //       title: "Portal Locked",
  //       description: "Access is currently restricted. Please try again later.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   if (!currentUser) return;

  //   try {
  //     const res: any = await getData(
  //       `get/all/records?id=${currentUser?.id}&role=${currentUser?.role}&page=${page}&limit=${limit}&search=${search}`
  //     );

  //     console.log("API Response: ", res);

  //     if (res?.record) {
  //       set({
  //         dataEntries: res?.record?.data,
  //         totalEntries: res?.record?.total,
  //         currentPage: res?.record?.page,
  //         itemsPerPage: res?.record?.limit,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching paginated records:", error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to fetch data entries",
  //       variant: "destructive",
  //     });
  //   }
  // },

  fetchCountAdminAndUser: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    const res = await get().fetchLockStatus();
    if (currentUser?.role !== "superadmin" && res) {
      get().logout();

      window.location.href = "/";
      toast({
        title: "Portal Locked",
        description: "Access is currently restricted. Please try again later.",
        variant: "destructive",
      });
      return;
    }
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
    } catch (error) {}
  },

  fetchLockStatus: async () => {
    try {
      const res = await getData(`lock-status`);
      set({ PortalLock: res?.disabled });
      return res?.disabled;
    } catch (error) {}
  },
}));
