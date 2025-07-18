import { getData, postData } from "@/services/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------- Interfaces ----------

export interface User {
  id: string;
  name: string;
  userName: string;
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
  dataEntries: DataEntry[];

  setUserAndToken: (user: User, token: string) => void;
  login: (userName: string, password: string) => boolean;
  logout: () => void;

  createUser: (userData: Omit<User, "id" | "createdAt">) => boolean;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;

  createDataEntry: (
    entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateDataEntry: (id: string, entryData: Partial<DataEntry>) => void;
  deleteDataEntry: (id: string) => void;

  getUsersByAdmin: (adminId: string) => User[];
  getDataEntriesByUser: (userId: string) => DataEntry[];

  fetchDataEntries: () => Promise<void>;
}

// ---------- Store Setup ----------

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,

      users: [
        {
          id: "1",
          name: "Super Admin",
          userName: "super",
          role: "superadmin",
          createdAt: new Date().toISOString(),
        },
      ],

      dataEntries: [],

      setUserAndToken: (user, token) => set({ currentUser: user, token }),

      login: (userName: string, password: string) => {
        const user = get().users.find((u) => u.userName === userName);
        if (user && password === "123") {
          set({ currentUser: user, token: "demo-token" });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, token: null });
      },

      createUser: (userData) => {
        const { currentUser, users } = get();
        if (!currentUser) return false;

        if (currentUser.role === "superadmin") {
          // Allowed
        } else if (currentUser.role === "admin" && userData.role === "user") {
          const adminUsers = users.filter(
            (u) => u.createdBy === currentUser.id
          );
          if (adminUsers.length >= 5) return false;
        } else {
          return false;
        }

        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          createdBy: currentUser.id,
          createdAt: new Date().toISOString(),
        };

        set({ users: [...users, newUser] });
        return true;
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

      createDataEntry: async (
        entryData: Omit<DataEntry, "id" | "createdAt" | "updatedAt">
      ) => {
        console.log("entryData: ", entryData);
        const useBackend = true;

        // 🛠️ camelCase to snake_case converter
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

        //  API Mode
        try {
          const { dataEntries } = get();

          // Convert to snake_case
          const payload = camelToSnake(entryData);
          console.log("payload:============= ", payload);

          //  Replace with your actual postData helper
          const response = await postData("/create/record", payload);

          const newEntry: DataEntry = response.record;
          set({ dataEntries: [...dataEntries, newEntry] });
          return { success: true };
        } catch (error) {
          console.error("Create data entry error:", error);
          return { success: false };
        }
      },

      updateDataEntry: (id, entryData) => {
        set((state) => ({
          dataEntries: state.dataEntries.map((entry) =>
            entry.id === id
              ? { ...entry, ...entryData, updatedAt: new Date().toISOString() }
              : entry
          ),
        }));
      },

      deleteDataEntry: (id) => {
        set((state) => ({
          dataEntries: state.dataEntries.filter((entry) => entry.id !== id),
        }));
      },

      getUsersByAdmin: (adminId: string) => {
        console.log('adminId: ', adminId);
        return get().users.filter((user) => user.createdBy === adminId);
      },

      getDataEntriesByUser: (userId: string) => {
        return get().dataEntries.filter((entry) => entry.id === userId);
      },

      fetchDataEntries: async () => {
        const { currentUser, dataEntries } = get();
        if (!currentUser || currentUser.role !== "superadmin") return;

        try {
          const res = await getData(`get/all/records?id=${currentUser.id}`);
          console.log("Fetched entries: ", res?.record);
          if (res?.record) {
            set({ dataEntries: res.record });
          }
        } catch (error) {
          console.error("Failed to fetch data entries:", error);
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

function camelToSnake(obj: any) {
  const newObj = {};
  for (let key in obj) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    newObj[snakeKey] = obj[key];
  }
  return newObj;
}
