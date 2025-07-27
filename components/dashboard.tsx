"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { Download, Users, FileText, UserCheck, BarChart3, FileDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AnalyticsDashboard } from "./analytics-dashboard";
import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import axios from "axios";

export function Dashboard() {
  const {
    currentUser,
    users,
    dataEntries,
    getUsersByAdmin,
    getDataEntriesByUser,
    fetchCountAdminAndUser,
    DashboardData,
  } = useAuthStore();
  console.log(
    "pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppDashboardData: ",
    DashboardData
  );

  useEffect(() => {
    const fetchCountAdminAndUserApi = async () =>
      await fetchCountAdminAndUser();
    fetchCountAdminAndUserApi();
  }, []);

  const [showAnalytics, setShowAnalytics] = useState(false);

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((item) =>
      Object.values(item)
        .map((value) =>
          typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value
        )
        .join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `${filename} has been downloaded.`,
    });
  };

  const exportUsers = () => {
    let usersToExport = [];

    if (currentUser?.role === "superadmin") {
      usersToExport = users.filter((u) => u.role !== "superadmin");
    } else if (currentUser?.role === "admin") {
      usersToExport = getUsersByAdmin(currentUser.id);
    }

    const exportData = usersToExport.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      createdBy: user.createdBy || "N/A",
    }));

    generateCSV(exportData, "users_export.csv");
  };

  const exportDataEntries = () => {
    let entriesToExport = [];

    if (currentUser?.role === "superadmin") {
      entriesToExport = dataEntries;
    } else if (currentUser?.role === "admin") {
      const adminUsers = getUsersByAdmin(currentUser.id);
      const userIds = [currentUser.id, ...adminUsers.map((u) => u.id)];
      entriesToExport = dataEntries.filter((entry) =>
        userIds.includes(entry.user_id)
      );
    } else {
      entriesToExport = getDataEntriesByUser(currentUser?.id || "");
    }

    const exportData = entriesToExport.map((entry) => ({
      id: entry.id,
      title: entry.title,
      description: entry.description,
      userId: entry.user_id,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    }));

    generateCSV(exportData, "data_entries_export.csv");
  };

  const exportAllData = () => {
    let allUsers = [];
    let allEntries = [];

    if (currentUser?.role === "superadmin") {
      allUsers = users.filter((u) => u.role !== "superadmin");
      allEntries = dataEntries;
    } else if (currentUser?.role === "admin") {
      allUsers = getUsersByAdmin(currentUser.id);
      const userIds = [currentUser.id, ...allUsers.map((u) => u.id)];
      allEntries = dataEntries.filter((entry) =>
        userIds.includes(entry.user_id)
      );
    }

    // Combine users and their data entries
    const combinedData = allUsers?.map((user) => {
      const userEntries = allEntries?.filter(
        (entry) => entry.user_id === user.id
      );
      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        userCreatedAt: user.createdAt,
        totalEntries: userEntries.length,
        entries: userEntries
          .map((entry) => `${entry.title}: ${entry.description}`)
          .join(" | "),
      };
    });

    generateCSV(combinedData, "complete_data_export.csv");
  };

  const getStats = () => {
    if (currentUser?.role === "superadmin") {
      const admins = users.filter((u) => u.role === "admin");
      const totalUsers = users.filter((u) => u.role === "user");
      return {
        admins: admins.length,
        users: totalUsers.length,
        entries: dataEntries.length,
      };
    } else if (currentUser?.role === "admin") {
      const myUsers = getUsersByAdmin(currentUser.id);
      const userIds = [currentUser.id, ...myUsers.map((u) => u.id)];
      const myEntries = dataEntries.filter((entry) =>
        userIds.includes(entry.user_id)
      );
      return {
        admins: 0,
        users: myUsers.length,
        entries: myEntries.length,
      };
    } else {
      const myEntries = getDataEntriesByUser(currentUser?.id || "");
      return {
        admins: 0,
        users: 0,
        entries: myEntries.length,
      };
    }
  };

  const stats = getStats();

  // Generate user's monthly data
  const generateUserMonthlyData = () => {
    if (currentUser?.role !== "user") return [];

    const now = new Date();
    const data: { [key: string]: number } = {};
    const userEntries = getDataEntriesByUser(currentUser.id);

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString("en-US", { month: "short" });
      data[key] = 0;
    }

    userEntries.forEach((entry) => {
      const entryDate = new Date(entry.created_at);
      const key = entryDate.toLocaleDateString("en-US", { month: "short" });
      if (data.hasOwnProperty(key)) {
        data[key]++;
      }
    });

    return Object.entries(data).map(([month, count]) => ({
      month,
      entries: count,
    }));
  };

  const userMonthlyData = generateUserMonthlyData();

  if (showAnalytics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setShowAnalytics(false)}>
            ← Back to Dashboard
          </Button>
        </div>
        <AnalyticsDashboard userRole={currentUser?.role || "user"} />
      </div>
    );
  }
  const userDailyData = DashboardData?.daily_user_record_stats?.map(
    (item: any) => ({
      date: new Date(item.date).toLocaleDateString("en-US"), // X axis
      entries: item.record_count, // Y axis
    })
  );
  console.log("userDailyData: ", userDailyData);

  const handleDonwloadCSV = async (user_id: any) => {
    if (!user_id) {
      toast({
        title: "Invalid User",
        description: "User ID is missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5002/api/global_hub/download/csv/user/by/id?user_id=${user_id}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `user_${currentUser?.name}_records.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      if (error.response && error.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const result = JSON.parse(reader.result as string);
            console.log("result: ", result);
            toast({
              title: "Download Failed",
              description: result.message || "No records found for this user.",
              variant: "destructive",
            });
          } catch {
            toast({
              title: "Download Failed",
              description: "Unable to parse error response.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(error.response.data);
      } else {
        toast({
          title: "Download Error",
          description: "Something went wrong while downloading the file.",
          variant: "destructive",
        });
      }

      console.error("Download error:", error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">User Dashboard</h2>
            <p className="text-blue-100">
              Access your personal dashboard and manage your activities.
            </p>
          </div>

          {/* <Button
            onClick={() => handleDonwloadCSV(currentUser?.id)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Download Excel
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentUser?.role !== "user" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {currentUser?.role === "superadmin"
                  ? "Total Admins"
                  : "My Users"}
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {currentUser?.role === "superadmin"
                  ? stats.admins
                  : stats.users}
              </div>
            </CardContent>
          </Card>
        )}

        {currentUser?.role === "superadmin" && (
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.users}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {currentUser?.role === "user" ? "My Entries" : "Total Entries"}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {DashboardData?.total_user_record_count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid  gap-6">
        {/* User Monthly Chart (for users only) */}
        {currentUser?.role === "user" && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>My Monthly Entries</span>
              </CardTitle>
              <CardDescription>
                Your data entry activity (last 6 months)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {DashboardData?.daily_user_record_stats?.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart
                    data={userDailyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRecords"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#82ca9d"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#82ca9d"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="entries"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorRecords)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  No data found
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>Export your data to CSV files for analysis and backup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {currentUser?.role !== "user" && (
                <Button onClick={exportUsers} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Users</span>
                </Button>
              )}

              <Button onClick={exportDataEntries} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data Entries</span>
              </Button>

              {currentUser?.role !== "user" && (
                <Button onClick={exportAllData} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export All Data</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
            <CardDescription>View detailed analytics, charts, and comprehensive reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowAnalytics(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics Dashboard
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
