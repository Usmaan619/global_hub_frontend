"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { deleteData, postData } from "@/services/api";

export function UserManagement() {
  const {
    currentUser,
    users,
    AdminData,
    createUser,
    updateUser,
    deleteUser,
    getUsersByAdmin,
    fetchAdminAndUser,
  } = useAuthStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  console.log("editingUser:=================== ", editingUser);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    password: "",
    role: "user" as "admin" | "user",
    user_limit: "",
  });
  useEffect(() => {
    getDataAPi();
  }, []);

  const getDataAPi = async () => {
    await fetchAdminAndUser();
  };

  useEffect(() => {}, [AdminData]);

  console.log("AdminData:managementpages----- ", AdminData);

  console.log("currentUser: ", currentUser);
  const canCreateUsers =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";
  const availableRoles =
    currentUser?.role === "superadmin" ? ["admin", "user"] : ["user"];
  // ["admin", "user"]

  const displayUsers =
    currentUser?.role === "superadmin"
      ? users.filter((u) => u?.role !== "superadmin")
      : getUsersByAdmin(currentUser?.id || "");

  console.log("displayUsers: ", displayUsers);
  // Removed handlePaste function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("editingUser: ", editingUser);
    if (editingUser) {
      // updateUser(editingUser.id, formData);

      try {
        const res = await postData(`/update/admin/${editingUser?.admin_id}`, {
          name: formData.name,
          username: formData.userName,
          password: formData.password,
          user_limit: formData.user_limit,
        });
        if (res?.success) {
          await getDataAPi();
          setEditingUser(null);

          toast({
            title: "Admin updated",
            description: "Admin has been updated successfully.",
          });
        }

        console.log("res: ", res);
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      const success = createUser(formData);
      if (success) {
        toast({
          title: "User created",
          description: "User has been created successfully.",
        });
        setIsCreateDialogOpen(false);
      } else {
        toast({
          title: "Failed to create user",
          description:
            "You may have reached the user limit or lack permissions.",
          variant: "destructive",
        });
      }
    }

    setFormData({
      name: "",
      userName: "",
      password: "",
      role: "admin",
      user_limit: "",
    });
  };

  const handleEdit = async (user: any) => {
    console.log("user: ", user);
    setEditingUser(user);
    setFormData({
      name: user.name,
      userName: user.username,
      password: user.admin_password,
      role: user.role,
      user_limit: user.user_limit,
    });

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
    console.log("userId: ", userId);
    // deleteUser(userId);

    try {
      // /delete/admin/user/by/id/:id
      const res = await deleteData(`/delete/admin/user/by/id/${userId}`);
      console.log('res: ', res);

      if (res?.success) {
        toast({
          title: "Admin deleted",
          description: "Admin has been deleted successfully.",
        });
        await getDataAPi();
      }
      console.log("res: ", res);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const [showUserLimit, setShowUserLimit] = useState<any>("");
  console.log("showUserLimit: ", showUserLimit);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-100 text-red-800";
      // case "admin":
      //   return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const [viewUser, setViewUser] = useState<any>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage users and their permissions
            </CardDescription>
          </div>
          {canCreateUsers && (
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="name">Name</Label>
                      {/* Removed Paste Button */}
                    </div>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="userName">Username</Label>
                      {/* Removed Paste Button */}
                    </div>
                    <Input
                      id="userName"
                      value={formData.userName}
                      onChange={(e) =>
                        setFormData({ ...formData, userName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">password</Label>
                      {/* Removed Paste Button */}
                    </div>
                    <Input
                      id="password"
                      type="Text"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "user") => {
                        setFormData({ ...formData, role: value });
                        setShowUserLimit(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.role === "admin" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="user_limit">User limit</Label>
                        {/* Removed Paste Button */}
                      </div>
                      <Input
                        id="user_limit"
                        type="number"
                        value={formData.user_limit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            user_limit: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    Create User
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="flex-row justify-center w-full">
              <TableHead className="text-center">No.</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Username</TableHead>
              <TableHead className="text-center">password</TableHead>
              <TableHead className="text-center">User Create Limit</TableHead>
              <TableHead className="text-center">Role Name</TableHead>
              <TableHead className="text-center">User Count</TableHead>
              <TableHead className="text-center">Created Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AdminData?.admins?.length > 0 ? (
              AdminData.admins.map((user: any, idx: any) => (
                <TableRow key={idx}>
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell className="text-center">{user?.name}</TableCell>
                  <TableCell className="text-center">
                    {user?.username}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.admin_password}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.user_limit}
                  </TableCell>

                  <TableCell className="text-center">
                    {user?.role_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.user_count}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(user?.admin_created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center justify-center">
                    <div className="flex space-x-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewUser(user)} //
                      >
                        <Eye className="h-4 w-4" />
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
                        onClick={() => handleDelete(user?.admin_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No admins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {viewUser && (
          <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
            <DialogContent className="max-w-5xl">
              <DialogHeader>
                <DialogTitle>Admin & Users Details</DialogTitle>
                <DialogDescription>Complete information</DialogDescription>
              </DialogHeader>

              {/* 🧑 Admin Table */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Admin Info</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Name</TableHead>
                      <TableHead className="text-center">Username</TableHead>
                      <TableHead className="text-center">Password</TableHead>
                      <TableHead className="text-center">Role</TableHead>
                      <TableHead className="text-center">User Limit</TableHead>
                      <TableHead className="text-center">User Count</TableHead>
                      <TableHead className="text-center">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-center">
                        {viewUser.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {viewUser.username}
                      </TableCell>
                      <TableCell className="text-center">
                        {viewUser.admin_password}
                      </TableCell>
                      <TableCell className="text-center">
                        {viewUser.role_name}
                      </TableCell>
                      <TableCell className="text-center">
                        {viewUser.user_limit || "N/A"}
                      </TableCell>
                      <TableCell className="text-center">
                        {viewUser.user_count}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(
                          viewUser.admin_created_at
                        ).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* 👥 Users Table */}
              {viewUser?.users?.length > 0 ? (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-2">
                    Users under this Admin ({viewUser.users.length})
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">No.</TableHead>
                        <TableHead className="text-center">Name</TableHead>
                        <TableHead className="text-center">Username</TableHead>
                        <TableHead className="text-center">Password</TableHead>
                        <TableHead className="text-center">Role</TableHead>
                        <TableHead className="text-center">
                          Created At
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewUser.users.map((u: any, i: number) => (
                        <TableRow key={u.id}>
                          <TableCell className="text-center">{i + 1}</TableCell>
                          <TableCell className="text-center">
                            {u.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {u.username}
                          </TableCell>
                          <TableCell className="text-center">
                            {u.password}
                          </TableCell>
                          <TableCell className="text-center">
                            {u.role}
                          </TableCell>
                          <TableCell className="text-center">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground mt-4">
                  No users found under this admin.
                </p>
              )}
            </DialogContent>
          </Dialog>
        )}

        {editingUser && (
          <Dialog
            open={!!editingUser}
            onOpenChange={() => setEditingUser(null)}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>Update user information</DialogDescription>
              </DialogHeader>

              {/* 🔧 Edit Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">Password</Label>
                  <Input
                    id="edit-password"
                    type="text"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-user-limit">User Limit</Label>
                  <Input
                    id="edit-user-limit"
                    type="number"
                    value={formData.user_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, user_limit: e.target.value })
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Update User
                </Button>
              </form>

              {/* 📋 Show User List if editing admin */}
              {editingUser?.role === "admin" &&
                editingUser?.users?.length > 0 && (
                  <>
                    <hr className="my-6" />
                    <h4 className="text-lg font-semibold mb-2">
                      Users under {editingUser.name}
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No.</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Password</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editingUser.users.map((u: any, i: number) => (
                          <TableRow key={u.id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>{u.password}</TableCell>
                            <TableCell>{u.role}</TableCell>
                            <TableCell>
                              {new Date(u.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
