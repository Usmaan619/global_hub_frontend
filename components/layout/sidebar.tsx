"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Settings,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { currentUser, logout } = useAuthStore();
  const { theme, sidebarCollapsed, toggleTheme, toggleSidebar } =
    useThemeStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
      roles: ["superadmin", "admin", "user"],
    },
    {
      icon: Users,
      label: "User Management",
      href: "/users",
      roles: ["superadmin", "admin"],
    },

    {
      icon: FileText,
      label: "Add Entry",
      href: "/entries/create",
      roles: ["superadmin", "admin", "user"],
    },
    {
      icon: FileText,
      label: "Entry List",
      href: "/entries",
      roles: ["superadmin", "admin", "user"],
    },

    {
      icon: Settings,
      label: "Settings",
      href: "",
      roles: ["superadmin", "admin"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(currentUser?.role || "")
  );

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-blue-900 to-blue-800 dark:from-gray-900 dark:to-gray-800 text-white h-screen flex flex-col shadow-xl transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with Logo and Toggle */}
      <div className="p-4 border-b border-blue-700 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 mb-3">
              <img
                src="/images/logo.png"
                alt="Global Hub"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-white hover:bg-blue-700 dark:hover:bg-gray-700 ml-auto"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!sidebarCollapsed && (
          <div className="border-t border-blue-700 dark:border-gray-700 pt-3">
            <p className="text-sm font-medium truncate">{currentUser?.name}</p>
            <p className="text-xs text-blue-200 dark:text-gray-300 capitalize truncate">
              {currentUser?.role?.replace("_", " ")}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-white hover:bg-blue-700 dark:hover:bg-gray-700 hover:text-white transition-all duration-200",
                  sidebarCollapsed ? "justify-center px-2" : "justify-start"
                )}
                onClick={() => router.push(item.href)}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")}
                />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme Toggle and Logout */}
      <div className="p-4 border-t border-blue-700 dark:border-gray-700 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-white hover:bg-blue-700 dark:hover:bg-gray-700 hover:text-white transition-all duration-200",
            sidebarCollapsed ? "justify-center px-2" : "justify-start"
          )}
          onClick={toggleTheme}
          title={sidebarCollapsed ? "Toggle Theme" : undefined}
        >
          {theme === "light" ? (
            <Moon className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")} />
          ) : (
            <Sun className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")} />
          )}
          {!sidebarCollapsed && (
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          )}
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "w-full text-white hover:bg-red-600 hover:text-white transition-all duration-200",
            sidebarCollapsed ? "justify-center px-2" : "justify-start"
          )}
          onClick={handleLogout}
          title={sidebarCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className={cn("h-4 w-4", !sidebarCollapsed && "mr-3")} />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </Button>

        {!sidebarCollapsed && (
          <div className="mt-3 pt-3 border-t border-blue-700 dark:border-gray-700">
            <p className="text-xs text-blue-200 dark:text-gray-300 text-center">
              © 2024 Global Hub
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
