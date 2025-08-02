"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Download, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AnalyticsProps {
  userRole: "superadmin" | "admin" | "user";
}

export function AnalyticsDashboard({ userRole }: AnalyticsProps) {
  const { currentUser, users, dataEntries, getUsersByAdmin } = useAuthStore();
  const [timeFilter, setTimeFilter] = useState<"monthly" | "yearly">("monthly");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [adminFilter, setAdminFilter] = useState<string>("all");

  // Get filtered data based on role and filters
  const getFilteredData = useMemo(() => {
    let filteredEntries = dataEntries;
    let filteredUsers = users;

    if (userRole === "admin" && currentUser) {
      const adminUsers = getUsersByAdmin(currentUser.id);
      const userIds = [currentUser.id, ...adminUsers.map((u) => u.id)];
      filteredEntries = dataEntries.filter((entry) =>
        userIds.includes(entry.userId)
      );
      filteredUsers = [currentUser, ...adminUsers];
    } else if (userRole === "user" && currentUser) {
      filteredEntries = dataEntries.filter(
        (entry) => entry.userId === currentUser.id
      );
      filteredUsers = [currentUser];
    }

    // Apply additional filters
    if (userFilter !== "all") {
      filteredEntries = filteredEntries.filter(
        (entry) => entry.userId === userFilter
      );
    }

    if (adminFilter !== "all" && userRole === "superadmin") {
      const adminUsers = getUsersByAdmin(adminFilter);
      const userIds = adminUsers.map((u) => u.id);
      filteredEntries = filteredEntries.filter((entry) =>
        userIds.includes(entry.userId)
      );
    }

    return { filteredEntries, filteredUsers };
  }, [
    userRole,
    currentUser,
    dataEntries,
    users,
    userFilter,
    adminFilter,
    getUsersByAdmin,
  ]);

  // Generate time-based data
  const generateTimeData = useMemo(() => {
    const { filteredEntries } = getFilteredData;
    const now = new Date();
    const data: { [key: string]: number } = {};

    if (timeFilter === "monthly") {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        data[key] = 0;
      }

      filteredEntries.forEach((entry) => {
        const entryDate = new Date(entry.createdAt);
        const key = entryDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        if (data.hasOwnProperty(key)) {
          data[key]++;
        }
      });
    } else {
      // Last 5 years
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        data[year.toString()] = 0;
      }

      filteredEntries.forEach((entry) => {
        const entryDate = new Date(entry.createdAt);
        const year = entryDate.getFullYear().toString();
        if (data.hasOwnProperty(year)) {
          data[year]++;
        }
      });
    }

    return Object.entries(data).map(([period, count]) => ({
      period,
      entries: count,
    }));
  }, [getFilteredData, timeFilter]);

  // User activity data
  const userActivityData = useMemo(() => {
    const { filteredEntries, filteredUsers } = getFilteredData;

    return filteredUsers
      .map((user) => {
        const userEntries = filteredEntries.filter(
          (entry) => entry.userId === user.id
        );
        return {
          name: user.name,
          entries: userEntries.length,
          role: user.role,
        };
      })
      .sort((a, b) => b.entries - a.entries)
      .slice(0, 10);
  }, [getFilteredData]);

  // Recent activity
  const recentActivity = useMemo(() => {
    const { filteredEntries } = getFilteredData;
    return filteredEntries
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
      .map((entry) => {
        const user = users.find((u) => u.id === entry.userId);
        return {
          ...entry,
          userName: user?.name || "Unknown User",
          userRole: user?.role || "unknown",
        };
      });
  }, [getFilteredData, users]);

  // Daily activity for the last 30 days
  const dailyActivityData = useMemo(() => {
    const { filteredEntries } = getFilteredData;
    const last30Days: { [key: string]: number } = {};
    const now = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      last30Days[key] = 0;
    }

    filteredEntries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt);
      const key = entryDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (last30Days.hasOwnProperty(key)) {
        last30Days[key]++;
      }
    });

    return Object.entries(last30Days).map(([date, count]) => ({
      date,
      entries: count,
    }));
  }, [getFilteredData]);

  // Role distribution (for super admin)
  const roleDistributionData = useMemo(() => {
    if (userRole !== "superadmin") return [];

    const roleCounts = users.reduce((acc, user) => {
      if (user.role !== "superadmin") {
        acc[user.role] = (acc[user.role] || 0) + 1;
      }
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(roleCounts).map(([role, count]) => ({
      name: role.charAt(0).toUpperCase() + role.slice(1).replace("_", " "),
      value: count,
      color: role === "admin" ? "#3B82F6" : "#10B981",
    }));
  }, [users, userRole]);

  const exportReport = () => {
    const { filteredEntries } = getFilteredData;
    const reportData = {
      summary: {
        totalEntries: filteredEntries.length,
        timeFilter,
        generatedAt: new Date().toISOString(),
        userFilter:
          userFilter !== "all"
            ? users.find((u) => u.id === userFilter)?.name
            : "All Users",
      },
      timeData: generateTimeData,
      userActivity: userActivityData,
      recentActivity: recentActivity.slice(0, 5),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${timeFilter}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report exported",
      description: "Analytics report has been downloaded successfully.",
    });
  };

  const availableUsers = useMemo(() => {
    if (userRole === "superadmin") {
      return users.filter((u) => u.role !== "superadmin");
    } else if (userRole === "admin" && currentUser) {
      return getUsersByAdmin(currentUser.id);
    }
    return [];
  }, [userRole, users, currentUser, getUsersByAdmin]);

  const availableAdmins = useMemo(() => {
    if (userRole === "superadmin") {
      return users.filter((u) => u.role === "admin");
    }
    return [];
  }, [userRole, users]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-600" />
                <span>Analytics & Reports</span>
              </CardTitle>
              <CardDescription>
                Comprehensive data insights and reporting
              </CardDescription>
            </div>
            <Button
              onClick={exportReport}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Time Period:</label>
              <Select
                value={timeFilter}
                onValueChange={(value: "monthly" | "yearly") =>
                  setTimeFilter(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {availableUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">User:</label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {availableAdmins.length > 0 && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Admin:</label>
                <Select value={adminFilter} onValueChange={setAdminFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Admins</SelectItem>
                    {availableAdmins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id}>
                        {admin.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time-based Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>
                {timeFilter === "monthly" ? "Monthly" : "Yearly"} Entries
              </span>
            </CardTitle>
            <CardDescription>Data entry trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={generateTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="entries"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Activity Chart */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Top Contributors</span>
            </CardTitle>
            <CardDescription>Most active users by entries created</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userActivityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="entries" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      {/* Daily Activity and Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity (Last 30 Days) */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Daily Activity (Last 30 Days)</span>
            </CardTitle>
            <CardDescription>Daily entry creation patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Role Distribution (Super Admin only) */}
        {userRole === "superadmin" && roleDistributionData.length > 0 && (
          // <Card className="border-0 shadow-lg">
          //   <CardHeader>
          //     <CardTitle className="flex items-center space-x-2">
          //       <Users className="h-5 w-5 text-orange-600" />
          //       <span>User Role Distribution</span>
          //     </CardTitle>
          //     <CardDescription>Distribution of users by role</CardDescription>
          //   </CardHeader>
          //   <CardContent>
          //     <ResponsiveContainer width="100%" height={300}>
          //       <PieChart>
          //         <Pie
          //           data={roleDistributionData}
          //           cx="50%"
          //           cy="50%"
          //           labelLine={false}
          //           label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          //           outerRadius={80}
          //           fill="#8884d8"
          //           dataKey="value"
          //         >
          //           {roleDistributionData.map((entry, index) => (
          //             <Cell key={`cell-${index}`} fill={entry.color} />
          //           ))}
          //         </Pie>
          //         <Tooltip />
          //       </PieChart>
          //     </ResponsiveContainer>
          //   </CardContent>
          // </Card>
          <></>
        )}
      </div>

      {/* Recent Activity */}
      {/* <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest data entries and user activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No recent activity found.</p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {activity.image && (
                    <img
                      src={activity.image || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-12 h-12 object-cover rounded-lg shadow-sm"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium truncate">{activity.title}</h4>
                      <Badge variant="outline" className="ml-2">
                        {activity.userRole}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">{activity.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>by {activity.userName}</span>
                      <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
