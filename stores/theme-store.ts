import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
  theme: "light" | "dark"
  sidebarCollapsed: boolean
  toggleTheme: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      sidebarCollapsed: true, // Closed by default

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light"
        set({ theme: newTheme })

        // Apply theme to document
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed })
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
      },
    }),
    {
      name: "theme-storage",
    },
  ),
)
