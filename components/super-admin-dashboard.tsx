"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import {
  Users,
  UserCheck,
  FileText,
  Building,
  TrendingUp,
  Activity,
  Eye,
  BarChart3,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AnalyticsDashboard } from "./analytics-dashboard";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { UserManagement } from "./user-management";
import { UserOverview } from "./user-overview";

export function SuperAdminDashboard() {
  const { currentUser, users, dataEntries, getUsersByAdmin, AdminData } =
    useAuthStore();
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [viewAdminDetails, setViewAdminDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (!currentUser || currentUser.role !== "superadmin") {
    return null;
  }
  console.log("users: ", users);

  const admins = users?.filter((u) => u?.role === "admin");
  const allUsers = users?.filter((u) => u?.role === "user");
  const totalEntries = dataEntries.length;

  // Calculate admin statistics
  const adminStats = admins?.map((admin) => {
    const adminUsers = getUsersByAdmin(admin.id);
    const adminUserIds = adminUsers?.map((u) => u.id);
    const adminEntries = dataEntries?.filter((entry) =>
      adminUserIds.includes(entry.user_id)
    );

    return {
      ...admin,
      userCount: adminUsers.length,
      entryCount: adminEntries.length,
      users: adminUsers,
      entries: adminEntries,
    };
  });

  // Generate monthly data for the last 6 months
  const generateMonthlyData = () => {
    const now = new Date();
    const data: { [key: string]: number } = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString("en-US", { month: "short" });
      data[key] = 0;
    }

    dataEntries.forEach((entry) => {
      const entryDate = new Date(entry?.created_at);
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

  const monthlyData = generateMonthlyData();

  // Admin performance data
  // const adminPerformanceData = adminStats.map((admin) => ({
  //   name: "",
  //   users: admin.userCount,
  //   entries: admin.entryCount,
  // }));

  // Role distribution data
  const roleDistributionData = [
    { name: "Admins", value: admins.length, color: "#3B82F6" },
    { name: "Users", value: allUsers.length, color: "#10B981" },
  ];

  // Daily activity for last 14 days
  const generateDailyData = () => {
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

    dataEntries.forEach((entry) => {
      const entryDate = new Date(entry?.created_at);
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

  const dailyData = generateDailyData();

  // Recent activity
  const recentEntries = dataEntries
    .sort(
      (a, b) =>
        new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime()
    )
    .slice(0, 5);

  const handleViewAdminDetails = (admin: any) => {
    setSelectedAdmin(admin);
    setViewAdminDetails(true);
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user?.name || "Unknown User";
  };

  if (showAnalytics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => setShowAnalytics(false)}>
            ← Back to Dashboard
          </Button>
        </div>
        <AnalyticsDashboard userRole="superadmin" />
      </div>
    );
  }

  const currentMonthDailyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get number of days in current month

    const data: { [key: string]: number } = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const key = date.toLocaleDateString("en-US", { day: "numeric" }); // Just day number
      data[key] = 0;
    }

    dataEntries.forEach((entry) => {
      const entryDate = new Date(entry?.created_at);
      if (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      ) {
        const key = entryDate.toLocaleDateString("en-US", { day: "numeric" });
        if (data.hasOwnProperty(key)) {
          data[key]++;
        }
      }
    });

    return Object.entries(data).map(([day, count]) => ({
      day,
      entries: count,
    }));
  }, [dataEntries]);

  const adminPerformanceData = AdminData?.admins?.map((admin: any) => ({
    name: admin.name,
    users: admin.users.length,
    entries: admin.total_records_created_by_users,
  }));


  const yearlyDailyData = useMemo(() => {
  const now = new Date();
  const data: { [month: string]: { [day: string]: number } } = {};

  // Loop for 12 months (0 = Jan, so go back 11 months)
  for (let m = 0; m < 12; m++) {
    const date = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    data[monthKey] = {};

    for (let d = 1; d <= daysInMonth; d++) {
      data[monthKey][d.toString()] = 0;
    }
  }

  // Fill data
  dataEntries.forEach((entry) => {
    const entryDate = new Date(entry?.created_at);
    const year = entryDate.getFullYear();
    const month = entryDate.getMonth();
    const day = entryDate.getDate();
    const monthKey = entryDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

    if (data[monthKey] && data[monthKey][day.toString()] !== undefined) {
      data[monthKey][day.toString()]++;
    }
  });

  // Flatten the data to an array for chart
  const result = Object.entries(data).flatMap(([month, days]) => {
    return Object.entries(days).map(([day, entries]) => ({
      day: `${month} ${day}`,
      entries,
    }));
  });

  return result;
}, [dataEntries]);


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Super Admin Dashboard</h2>
            <p className="text-blue-100">
              Complete overview of your organization's data management system.
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

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily entries</CardTitle>
            <Building className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {admins.length}
            </div>
            <p className="text-xs text-muted-foreground">Daily</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Month Entries
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {admins.length > 0
                ? Math.round(allUsers.length / admins.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {allUsers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active data entry users
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {totalEntries}
            </div>
            <p className="text-xs text-muted-foreground">
              Data entries created
            </p>
          </CardContent>
        </Card>

        {/* <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Admin</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {admins.length > 0 ? Math.round(allUsers.length / admins.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Users per admin</p>
          </CardContent>
        </Card> */}
      </div>
<ResponsiveContainer width="100%" height={350}>
  <AreaChart data={yearlyDailyData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={30} /> {/* show fewer labels */}
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
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="border-0 shadow-lg col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Current Month Daily Entries</span>
            </CardTitle>
            <CardDescription>
              Daily data entry activity for the current month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={currentMonthDailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
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

        {/* <Card className="border-0 shadow-lg col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span>Users per Admin</span>
          </CardTitle>
          <CardDescription>
            Number of users and entries under each admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={adminPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" name="Users" />
              <Bar dataKey="entries" fill="#10B981" name="Entries" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

        {/* Monthly Entries Chart */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Monthly Entries </span>
            </CardTitle>
            <CardDescription>
              Data entry  months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
        </Card> */}

        {/* Admin Performance Chart */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Users Performance</span>
            </CardTitle>
            <CardDescription>
              Users and entries managed by each admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={adminPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" name="Users" />
                <Bar dataKey="entries" fill="#10B981" name="Entries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      {/* Daily Activity and Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Activity Chart */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span>Daily Activity (Last 14 Days)</span>
            </CardTitle>
            <CardDescription>Daily entry creation patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Role Distribution Chart */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-orange-600" />
              <span>User Role Distribution</span>
            </CardTitle>
            <CardDescription>Distribution of users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Overview */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <span>Admin Overview</span>
            </CardTitle>
            <CardDescription>
              Performance and statistics for each admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adminStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No admins created yet.
                </p>
              ) : (
                adminStats.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{admin.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {admin.email}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800"
                        >
                          {admin.userCount}/5 users
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          {admin.entryCount} entries
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAdminDetails(admin)}
                      className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card> */}

        {/* Recent Activity */}
        {/* <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest data entries across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEntries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activity.</p>
              ) : (
                recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {entry.image && (
                      <img
                        src={entry.image || "/placeholder.svg"}
                        alt={entry.title}
                        className="w-10 h-10 object-cover rounded shadow-sm"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{entry.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{entry.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">by {getUserName(entry.userId)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card> */}
      </div>
      <div className="space-y-6">
        <UserManagement />
        <UserOverview />
      </div>
      {/* Admin Details Dialog */}
      <Dialog open={viewAdminDetails} onOpenChange={setViewAdminDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedAdmin?.name} - Admin Details</DialogTitle>
            <DialogDescription>
              Complete overview of admin's users and their data entries
            </DialogDescription>
          </DialogHeader>

          {selectedAdmin && (
            <div className="space-y-6">
              {/* Admin Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedAdmin.userCount}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Users Created
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedAdmin.entryCount}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Entries
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedAdmin.userCount > 0
                        ? Math.round(
                            selectedAdmin.entryCount / selectedAdmin.userCount
                          )
                        : 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Avg per User
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Users Table */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Users ({selectedAdmin.userCount}/5)
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Entries</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedAdmin.users.map((user: any) => {
                      const userEntries = selectedAdmin.entries.filter(
                        (e: any) => e.user_id === user.id
                      );
                      return (
                        <TableRow key={user?.id}>
                          <TableCell className="font-medium">
                            {user?.name}
                          </TableCell>
                          <TableCell>{user?.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {userEntries.length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user?.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
