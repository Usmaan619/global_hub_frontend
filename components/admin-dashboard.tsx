"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { Users, FileText, Calendar } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import axios from "axios";
import { deleteData } from "@/services/api";
import { toast } from "./ui/use-toast";

export function AdminDashboard() {
  const {
    currentUser,
    getUsersByAdmin,
    dataEntries,
    fetchCountAdminAndUser,
    fetchAdminAndUser,
    DashboardData,
    AdminData,
  } = useAuthStore();
  const [showAnalytics, setShowAnalytics] = useState(false);
  useEffect(() => {
    const fetchCountAdminAndUserApi = async () => {
      await fetchCountAdminAndUser();
      await fetchAdminAndUser();
    };
    fetchCountAdminAndUserApi();
  }, []);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const myUsers = getUsersByAdmin(currentUser.id);
  const user_ids = myUsers?.map((u) => u.id);
  const myUsersDataEntries = dataEntries?.filter((entry) =>
    user_ids.includes(entry?.user_id)
  );

  // Get recent activity
  const recentUsers = myUsers
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  const recentEntries = myUsersDataEntries
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  // Generate monthly data for admin's users
  const generateAdminMonthlyData = () => {
    const now = new Date();
    const data: { [key: string]: number } = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString("en-US", { month: "short" });
      data[key] = 0;
    }

    myUsersDataEntries.forEach((entry) => {
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

  const adminMonthlyData = generateAdminMonthlyData();

  // User performance data for admin's users
  const userPerformanceData = myUsers
    .map((user) => {
      const userEntries = dataEntries.filter(
        (entry) => entry.user_id === user.id
      );
      return {
        name: user.name.split(" ")[0], // First name only
        entries: userEntries.length,
      };
    })
    .sort((a, b) => b.entries - a.entries);

  // Daily activity for last 14 days
  const generateAdminDailyData = () => {
    const last14Days: { [key: string]: number } = {};
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      last14Days[key] = 0;
    }

    myUsersDataEntries.forEach((entry) => {
      const entryDate = new Date(entry.created_at);
      const key = entryDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (last14Days.hasOwnProperty(key)) {
        last14Days[key]++;
      }
    });

    return Object.entries(last14Days).map(([date, count]) => ({
      date,
      entries: count,
    }));
  };

  const adminDailyData = generateAdminDailyData();

  if (showAnalytics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setShowAnalytics(false)}>
            ← Back to Dashboard
          </Button>
        </div>
        <AnalyticsDashboard userRole="admin" />
      </div>
    );
  }

  const handleDonwloadCSV = async (u: any) => {
    try {
      const response = await axios.get(
        `https://api.globalhub-bpo.com/api/global_hub/download/csv/user/by/id?user_id=${u?.id}`,
        {
          responseType: "blob", // 👈 VERY important
        }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `user_${u?.id}_records.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert("Failed to download Excel file.");
    }
  };

  const handleEdit = async (user: any) => {
    //
    // setEditingUser(user);
    // setFormData({
    //   name: user.name,
    //   userName: user.username,
    //   password:
    //     currentUser?.role === "superadmin"
    //       ? user.admin_password
    //       : user.password,
    //   role: user.role,
    //   user_limit: user.user_limit,
    // });
    //     {
    //     "admin_id": 4,
    //     "name": "p",
    //     "username": "p",
    //     "admin_created_at": "2025-07-19T17:55:21.000Z",
    //     "user_limit": 6,
    //     "role_name": "admin",
    //     "admin_password": "p",
    //     "user_count": 0,
    //     "users": []
    // }
  };

  const handleDelete = async (userId: string) => {
    // deleteUser(userId);

    try {
      let res;
      // superadmin
      // /delete/admin/user/by/id/:id

      // admin
      // delete/user/by/id/:id

      // if (currentUser?.role === "superadmin") {
      //   res = await deleteData(`/delete/admin/user/by/id/${userId}`);
      // }
      if (currentUser?.role === "admin") {
        res = await deleteData(`/delete/user/by/id/${userId}`);
      }

      if (res?.success) {
        const msg = currentUser?.role === "superadmin" ? "Admin" : "User";
        toast({
          title: `${msg} deleted`,
          description: `${msg} has been deleted successfully.`,
        });
        await fetchCountAdminAndUser();
      }
    } catch (error) {}
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {currentUser?.name}!
            </h2>
            <p className="text-blue-100">
              Here's what's happening with your team today.
            </p>
          </div>
          {/* <Button
            onClick={() => setShowAnalytics(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {DashboardData?.admin_detail?.total_users || 0}
            </div>
            <p className="text-xs text-muted-foreground">Your users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {DashboardData?.admin_detail?.total_record_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">From all your users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              User Entries Count
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {/* {
                myUsersDataEntries.filter((entry) => {
                  const entryDate = new Date(entry.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return entryDate > weekAgo;
                }).length
              } */}
              {DashboardData?.admin_detail?.user_record_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">User entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Entries Chart */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Monthly Team Entries</span>
            </CardTitle>
            <CardDescription>Your team's data entry trends (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={adminMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="entries" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* User Performance Chart */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>User Performance</span>
            </CardTitle>
            <CardDescription>
              Entries created by each team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="entries" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        <Card className="border-0 shadow-lg col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Months Entries</span>
            </CardTitle>
            <CardDescription>Monthly data entry activity</CardDescription>
          </CardHeader>
          <CardContent>
            {DashboardData?.monthly_user_record_stats_admin?.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={DashboardData.monthly_user_record_stats_admin}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="user_name"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="record_count"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
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
      </div>

      {/* Daily Activity Chart */}
      {/* <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Daily Team Activity (Last 14 Days)</span>
            </CardTitle>
            <CardDescription>
              Daily entry creation patterns for your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={adminDailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="entries"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: "#8B5CF6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}
      <div className="grid  gap-6">
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
        {/* My Users Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>My Users</CardTitle>
            <CardDescription>Users you have created and manage</CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser?.role === "admin" && (
              <Table>
                <TableHeader>
                  <TableRow className="flex-row justify-center w-full">
                    <TableHead className="text-center">No.</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Username</TableHead>
                    <TableHead className="text-center">Password</TableHead>
                    <TableHead className="text-center">
                      Total Entries Created
                    </TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-center">Created Date</TableHead>
                    {/* <TableHead className="text-center">Actions</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AdminData?.admin_users?.length > 0 ? (
                    AdminData.admin_users.map((user: any, idx: any) => (
                      <TableRow key={idx}>
                        <TableCell className="text-center">{idx + 1}</TableCell>
                        <TableCell className="text-center">
                          {user?.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {user?.username}
                        </TableCell>
                        <TableCell className="text-center">
                          {user?.password}
                        </TableCell>
                        <TableCell className="text-center">
                          {user?.record_count}
                        </TableCell>
                        <TableCell className="text-center">
                          {user?.role}
                        </TableCell>
                        <TableCell className="text-center">
                          {new Date(user?.created_at).toLocaleDateString()}
                        </TableCell>
                        {/* <TableCell className="text-center justify-center">
                          <div className="flex space-x-2 justify-center">
                            

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDonwloadCSV(user)}
                            >
                              <FileDown color="green" size={23} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(user?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* <div className="space-y-4">
              {myUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No users created yet. Go to User Management to add users.
                </p>
              ) : (
                myUsers.map((user) => {
                  const userEntries = dataEntries.filter(
                    (entry) => entry?.user_id === user.id
                  );
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.userName}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {userEntries.length} entries
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div> */}

        {/* Recent Activity */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest data entries from your users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity from your users.</p>
              ) : (
                recentEntries.map((entry) => {
                  const user = myUsers.find((u) => u.id === entry.user_id)
                  return (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      {entry.image && (
                        <img
                          src={entry.image || "/placeholder.svg"}
                          alt={entry.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{entry.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{entry.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">by {user?.name || "Unknown User"}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
