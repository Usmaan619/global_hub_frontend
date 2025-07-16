import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  userName: string;
  role: "super_admin" | "admin" | "user";
  createdBy?: string;
  createdAt: string;
}

export interface DataEntry {
  id: string;
  // Personal Information
  recordNo: string;
  leadNo: string;
  applicantFirstName: string;
  applicantLastName: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  applicantDOB: string;
  coApplicantFirstName: string;
  coApplicantLastName: string;
  bestTimeToCall: string;
  personalRemark: string;

  // Asset Information
  typeOfProperty: string;
  propertyValue: string;
  mortgageType: string;
  loanAmount: string;
  loanTerm: string;
  interestType: string;
  monthlyInstallment: string;
  existingLoan: string;
  annualIncome: string;
  downPayment: string;
  assetRemark: string;

  // Official Information
  lenderName: string;
  loanOfficerFirstName: string;
  loanOfficerLastName: string;
  trNumber: string;
  niNumber: string;
  occupation: string;
  otherIncome: string;
  creditCardType: string;
  creditScore: string;
  officialRemark: string;

  image: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  currentUser: User | null;
  users: User[];
  dataEntries: DataEntry[];
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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        {
          id: "1",
          name: "Super Admin",
          userName: "super",
          role: "super_admin",
          createdAt: new Date().toISOString(),
        },
        // Add demo admin
        {
          id: "2",
          name: "John Admin",
          userName: "admin",
          role: "admin",
          createdBy: "1",
          createdAt: new Date().toISOString(),
        },
        // Add demo users under this admin
        {
          id: "3",
          name: "Alice User",
          userName: "alice",
          role: "user",
          createdBy: "2",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Bob User",
          userName: "bob",
          role: "user",
          createdBy: "2",
          createdAt: new Date().toISOString(),
        },
      ],
      dataEntries: [],

      login: (userName: string, password: string) => {
        const user = get().users.find((u) => u.userName === userName);
        if (user && password === "123") {
          set({ currentUser: user });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null });
      },

      createUser: (userData) => {
        const { currentUser, users } = get();
        if (!currentUser) return false;

        if (currentUser.role === "super_admin") {
          // Super admin can create both admins and users
        } else if (currentUser.role === "admin" && userData.role === "user") {
          // Admin can only create users, and check for limit
          const adminUsers = users.filter(
            (u) => u.createdBy === currentUser.id
          );
          if (adminUsers.length >= 5) return false;
        } else {
          return false; // Disallow other combinations or roles
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

      createDataEntry: (entryData) => {
        const newEntry: DataEntry = {
          ...entryData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as DataEntry; // Cast to DataEntry to satisfy type, as Omit doesn't include all fields

        set((state) => ({
          dataEntries: [...state.dataEntries, newEntry],
        }));
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

      getUsersByAdmin: (adminId) => {
        return get().users.filter((user) => user.createdBy === adminId);
      },

      getDataEntriesByUser: (userId) => {
        return get().dataEntries.filter((entry) => entry.userId === userId);
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
