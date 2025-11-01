"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/hooks/use-toast";
import { postData } from "@/services/api";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { getRecaptchaToken } from "@/lib/recaptcha";
// Removed Copy import

export function LoginForm() {
  const [UserName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { fetchLockStatus, setUserAndToken } = useAuthStore();

  useEffect(() => {
    const fetchLockStatusApi = async () => {
      const res = await fetchLockStatus();
    };
    fetchLockStatusApi();
  }, []);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

      // const token = await getRecaptchaToken("contact_form");
      // console.log('tokensssssssssssssssssssssss: ', token);


    setLoading(true);
    const lock = await fetchLockStatus();

    try {
      const res = await postData("/auth/login", {
        username: UserName,
        password,
      });

      if (!res.success) {
        toast({
          title: "Login failed",
          description: res.message,
          variant: "destructive",
        });
        return;
      }

      const user = { ...res.user, role: res.role };

      // Portal lock check (optional)

      if (res.role !== "superadmin" && lock) {
        toast({
          title: "Portal Locked",
          description:
            "Access is currently restricted. Please try again later.",
          variant: "destructive",
        });
        return;
      }

      // Save user & token, session in Zustand + sessionStorage
      setUserAndToken(user, res.token, res.session);

      // Redirect by role
      if (res.role === "admin") {
        router.push("/admin");
      } else if (res.role === "user") {
        router.push("/entries");
      } else {
        router.push("/dashboard");
      }

      toast({ title: "Success", description: res.message });
    } catch (error: any) {
      toast({
        title: "Login error",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center text-white 
    bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
    >
      <div className="w-full max-w-md">
        {/* Logo Section */}

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="text-center mb-8">
              <img
                src="/images/logo.png"
                alt="Global Hub - Business Process Outsourcing"
                className="h-20 mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold mb-2">Data Entry Portal</h1>
              <p className="">
                Secure access to your business data management system
              </p>
            </div>
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              spellCheck="false"
              autoComplete="off"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="UserName">Username </Label>
                  {/* Removed Paste Button */}
                </div>
                <Input
                  id="UserName"
                  type="text"
                  value={UserName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your Username"
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-11 pr-10" // Add pr-10 for icon spacing
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center mt-6 text-sm text-gray-500">
                <p>© 2024 Global Hub. All rights reserved.</p>
              </div>
            </form>

            {/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Demo Accounts:
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>
                  <strong>Super Admin:</strong> super@admin.com
                </p>
                <p>
                  <strong>Admin:</strong> admin@company.com
                </p>
                <p>
                  <strong>User:</strong> alice@company.com
                </p>
                <p className="text-gray-500 mt-2">
                  Password for all: <strong>password123</strong>
                </p>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
