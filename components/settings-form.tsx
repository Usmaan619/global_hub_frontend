"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { toast } from "@/hooks/use-toast";
import { User, Palette, Bell, Lock, Trash2 } from "lucide-react";
import { postData } from "@/services/api";

export function SettingsForm() {
  const { currentUser, updateUser, fetchLockStatus, PortalLock } =
    useAuthStore();
  const { theme, toggleTheme, sidebarCollapsed, toggleSidebar } =
    useThemeStore();
  console.log("PortalLock: ", PortalLock);
  const [lockPortal, setLockPortal] = useState<any>(PortalLock);

  useEffect(() => {
    const fetchLockStatusApi = async () => {
      const res = await fetchLockStatus();
      setLockPortal(res);
    };
    fetchLockStatusApi();
  }, []);

  // http://localhost:5002/api/global_hub/lock-status

  // Local state for form fields
  const [userName, setUserName] = useState(currentUser?.name || "");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("utc");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationSound, setNotificationSound] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  console.log("lockPortal: ", lockPortal);

  const handleLockPortal = async (checked: any) => {
    try {
      setLockPortal(checked);
      try {
        const response = await postData("lock-status/toggle", {
          disabled: checked,
        });
        console.log("response:==================lock-status/toggle ", response);
        if (response?.success) {
        }
      } catch (error) {
        console.error("Create data entry error:", error);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleSaveChanges = async () => {
    // Simulate API call for saving changes
    // In a real app, you would send this data to your backend
    console.log("Saving changes:", {
      userName,
      language,
      timezone,
      emailNotifications,
      pushNotifications,
      notificationSound,
    });

    if (currentUser) {
      try {
        await updateUser(currentUser.id, { name: userName });
        toast({
          title: "Settings saved",
          description: "Your profile settings have been updated.",
        });
      } catch (error) {
        toast({
          title: "Error saving settings",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "No user logged in.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    // Simulate password change
    console.log("Changing password:", { currentPassword, newPassword });
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleDeleteAccount = () => {
    // In a real app, this would trigger a confirmation dialog and then an API call
    console.log("Deleting account...");
    toast({
      title: "Account Deletion Initiated",
      description:
        "Your account deletion request has been received. Further steps may be required.",
      variant: "destructive",
    });
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-xl">
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Configure your personal and application preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" /> General
            </TabsTrigger>
            {/* <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" /> Appearance
            </TabsTrigger> */}
            {/* <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger> */}
            {/* <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Account
            </TabsTrigger> */}
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your Name"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-toggle">Collapse Sidebar</Label>
              <Switch
                id="sidebar-toggle"
                checked={sidebarCollapsed}
                onCheckedChange={toggleSidebar}
              />
            </div>
            {currentUser?.role === "superadmin" && (
              <div className="flex items-center justify-between">
                <Label htmlFor="sidebar-toggle">Lock Portal</Label>
                <Switch
                  id="sidebar-toggle"
                  checked={lockPortal}
                  onCheckedChange={handleLockPortal}
                />
              </div>
            )}
            {/* <div className="space-y-2"> */}
            {/* <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={currentUser?.userName || ""}
                disabled
                className="cursor-not-allowed"
              />
              <p className="text-sm text-muted-foreground">
                Email cannot be changed here.
              </p> */}
            {/* </div> */}
            {/* <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select a timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Standard Time</SelectItem>
                  <SelectItem value="pst">Pacific Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            {/* <Button onClick={handleSaveChanges}>Save Changes</Button> */}
          </TabsContent>

          {/* Appearance Settings Tab */}
          <TabsContent value="appearance" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <Switch
                id="theme-toggle"
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sidebar-toggle">Collapse Sidebar</Label>
              <Switch
                id="sidebar-toggle"
                checked={sidebarCollapsed}
                onCheckedChange={toggleSidebar}
              />
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </TabsContent>

          {/* Notifications Settings Tab */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notification-sound">Notification Sound</Label>
              <Switch
                id="notification-sound"
                checked={notificationSound}
                onCheckedChange={setNotificationSound}
              />
            </div>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleChangePassword}>Update Password</Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-600">
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
