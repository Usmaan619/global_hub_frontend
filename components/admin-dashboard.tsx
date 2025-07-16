"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"
import { Users, FileText, UserPlus, Calendar, BarChart3 } from "lucide-react"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { useState } from "react"
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
  Area,
  AreaChart,
} from "recharts"

export function AdminDashboard() {
  const { currentUser, getUsersByAdmin, dataEntries } = useAuthStore()
  const [showAnalytics, setShowAnalytics] = useState(false)

  if (!currentUser || currentUser.role !== "admin") {
    return null
  }

  const myUsers = getUsersByAdmin(currentUser.id)
  const userIds = myUsers.map((u) => u.id)
  const myUsersDataEntries = dataEntries.filter((entry) => userIds.includes(entry.userId))

  // Get recent activity
  const recentUsers = myUsers
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const recentEntries = myUsersDataEntries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Generate monthly data for admin's users
  const generateAdminMonthlyData = () => {
    const now = new Date()
    const data: { [key: string]: number } = {}

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = date.toLocaleDateString("en-US", { month: "short" })
      data[key] = 0
    }

    myUsersDataEntries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt)
      const key = entryDate.toLocaleDateString("en-US", { month: "short" })
      if (data.hasOwnProperty(key)) {
        data[key]++
      }
    })

    return Object.entries(data).map(([month, count]) => ({
      month,
      entries: count,
    }))
  }

  const adminMonthlyData = generateAdminMonthlyData()

  // User performance data for admin's users
  const userPerformanceData = myUsers
    .map((user) => {
      const userEntries = dataEntries.filter((entry) => entry.userId === user.id)
      return {
        name: user.name.split(" ")[0], // First name only
        entries: userEntries.length,
      }
    })
    .sort((a, b) => b.entries - a.entries)

  // Daily activity for last 14 days
  const generateAdminDailyData = () => {
    const last14Days: { [key: string]: number } = {}
    const now = new Date()

    for (let i = 13; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const key = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      last14Days[key] = 0
    }

    myUsersDataEntries.forEach((entry) => {
      const entryDate = new Date(entry.createdAt)
      const key = entryDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (last14Days.hasOwnProperty(key)) {
        last14Days[key]++
      }
    })

    return Object.entries(last14Days).map(([date, count]) => ({
      date,
      entries: count,
    }))
  }

  const adminDailyData = generateAdminDailyData()

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
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {currentUser.name}!</h2>
            <p className="text-blue-100">Here's what's happening with your team today.</p>
          </div>
          <Button
            onClick={() => setShowAnalytics(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
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
            <div className="text-2xl font-bold text-blue-600">{myUsers.length}</div>
            <p className="text-xs text-muted-foreground">{5 - myUsers.length} slots remaining</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{myUsersDataEntries.length}</div>
            <p className="text-xs text-muted-foreground">From all your users</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {
                myUsers.filter((user) => {
                  const userEntries = dataEntries.filter((entry) => entry.userId === user.id)
                  return userEntries.length > 0
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Users with data entries</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {
                myUsersDataEntries.filter((entry) => {
                  const entryDate = new Date(entry.createdAt)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return entryDate > weekAgo
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">New entries this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
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
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>User Performance</span>
            </CardTitle>
            <CardDescription>Entries created by each team member</CardDescription>
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
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Daily Team Activity (Last 14 Days)</span>
            </CardTitle>
            <CardDescription>Daily entry creation patterns for your team</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={adminDailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Users Overview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>My Users</CardTitle>
            <CardDescription>Users you have created and manage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No users created yet. Go to User Management to add users.
                </p>
              ) : (
                myUsers.map((user) => {
                  const userEntries = dataEntries.filter((entry) => entry.userId === user.id)
                  return (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.userName}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{userEntries.length} entries</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

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
                  const user = myUsers.find((u) => u.id === entry.userId)
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
  )
}
