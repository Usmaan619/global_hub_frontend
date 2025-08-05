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
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, FileDown } from "lucide-react";
import { deleteData, postData } from "@/services/api";
import axios from "axios";

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

  const [formData, setFormData] = useState<any>({
    name: "",
    userName: "",
    password: "",
    role: "user",
    user_limit: "",
  });
  useEffect(() => {
    getDataAPi();
  }, []);

  const getDataAPi = async () => {
    await fetchAdminAndUser();
  };

  useEffect(() => {}, [AdminData]);

  const canCreateUsers =
    currentUser?.role === "superadmin" || currentUser?.role === "admin";
  const availableRoles =
    currentUser?.role === "superadmin" ? ["user"] : ["user"];
  // ["admin", "user"]

  const displayUsers =
    currentUser?.role === "superadmin"
      ? users.filter((u) => u?.role !== "superadmin")
      : getUsersByAdmin(currentUser?.id || "");

  const resetForm = () => {
    setFormData({
      name: "",
      userName: "",
      password: "",
      role: "user",
      user_limit: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const showToast = (
      title: string,
      description: string,
      variant?: "destructive"
    ) => {
      toast({ title, description, ...(variant && { variant }) });
    };

    const isSuperadmin = currentUser?.role === "superadmin";

    const isAdmin = currentUser?.role === "admin";

    try {
      if (editingUser) {
        let endpoint = "";
        let payload: Record<string, any> = {
          name: formData.name,
          username: formData.userName,
          password: formData.password,
        };

        if (isSuperadmin) {
          endpoint = `/update/user/by/id/${editingUser.id}`;
          payload.user_limit = formData.user_limit;
        } else if (isAdmin) {
          endpoint = `/update/user/by/id/${editingUser.id}`;
        }
        // User limit reached for this admin
        const res = await postData(endpoint, payload);

        if (res?.success) {
          setEditingUser(null);
          await fetchAdminAndUser();
          showToast("Admin updated", "Admin has been updated successfully.");
        }
      } else {
        const success = createUser(formData);
        if (success) {
          showToast("User created", "User has been created successfully.");
          setIsCreateDialogOpen(false);
          await fetchAdminAndUser();
        }
      }
    } catch (error) {
    } finally {
      resetForm();
    }
  };

  const handleEdit = async (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      userName: user.username,
      password: user.password,
      role: user.role,
      user_limit: "",
    });
  };

  const handleDelete = async (userId: string) => {
    // deleteUser(userId);

    try {
      // let res;
      // superadmin
      // /delete/admin/user/by/id/:id

      // admin
      // delete/user/by/id/:id

      // if (currentUser?.role === "superadmin") {
      //   res = await deleteData(`/delete/admin/user/by/id/${userId}`);
      // }
      // if (currentUser?.role === "admin") {
      const res = await deleteData(`/delete/user/by/id/${userId}`);
      // }

      if (res?.success) {
        const msg = currentUser?.role === "superadmin" ? "Admin" : "User";
        toast({
          title: `${msg} deleted`,
          description: `${msg} has been deleted successfully.`,
        });
        await fetchAdminAndUser();
      }
    } catch (error) {}
  };

  const [showUserLimit, setShowUserLimit] = useState<any>("");

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "superadmin":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const [viewUser, setViewUser] = useState<any>(null);

  const handleDonwloadCSV = async (user: any) => {
    if (!user?.id) {
      toast({
        title: "Invalid User",
        description: "User ID is missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.get(
        `https://api.globalhub-bpo.com/api/global_hub/download/csv/user/by/id?user_id=${user.id}`,
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
      link.download = `user_${user.name}_records.xlsx`;
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
    }
  };
  const handleDeleteAllEntriesByUser = async (userId: string) => {
    // deleteUser(userId);

    try {
      if (currentUser?.role === "superadmin") {
        const res = await deleteData(`/delete/all/record/by/user/id/${userId}`);

        if (res?.success) {
          toast({
            title: `Deleted`,
            description: `Entries has been deleted successfully.`,
          });
          await fetchAdminAndUser();
        }
      }
    } catch (error) {}
  };
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
              onOpenChange={(o: any) => {
                setIsCreateDialogOpen(o);
                resetForm();
              }}
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
                <form
                  spellCheck="false"
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
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
        {currentUser?.role === "superadmin" && (
          <Table>
            <TableHeader>
              <TableRow className="flex-row justify-center w-full">
                <TableHead className="text-center">No.</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Username</TableHead>
                <TableHead className="text-center">password</TableHead>
                <TableHead className="text-center">
                  Total Entrires Created By Users
                </TableHead>
                <TableHead className="text-center">Role Name</TableHead>
                <TableHead className="text-center">Created By</TableHead>
                <TableHead className="text-center">Created Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
                <TableHead className="text-center">
                  Delete All Entries
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AdminData?.direct_superadmin_users?.users?.length > 0 ? (
                AdminData.direct_superadmin_users?.users?.map(
                  (user: any, idx: any) => (
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
                        {user?.created_by}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(user?.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center justify-center">
                        <div className="flex space-x-2 justify-center">
                          <Button
                            variant="outline"
                            title="Download Excel"
                            size="sm"
                            onClick={() => handleDonwloadCSV(user)}
                          >
                            <FileDown color="green" size={23} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Edit User Details"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            title="Delete User"
                            onClick={() => handleDelete(user?.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          title="Delete All Entries For This User"
                          onClick={() => handleDeleteAllEntriesByUser(user?.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No admins found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

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
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AdminData?.admin_users?.length > 0 ? (
                AdminData.admin_users.map((user: any, idx: any) => (
                  <TableRow key={idx}>
                    <TableCell className="text-center">{idx + 1}</TableCell>
                    <TableCell className="text-center">{user?.name}</TableCell>
                    <TableCell className="text-center">
                      {user?.username}
                    </TableCell>
                    <TableCell className="text-center">
                      {user?.password}
                    </TableCell>
                    <TableCell className="text-center">
                      {user?.record_count}
                    </TableCell>
                    <TableCell className="text-center">{user?.role}</TableCell>
                    <TableCell className="text-center">
                      {new Date(user?.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center justify-center">
                      <div className="flex space-x-2 justify-center">
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button> */}

                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDonwloadCSV(user)}
                        >
                          <FileDown color="green" size={23} />
                        </Button> */}
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
                    </TableCell>
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

        {}
        {viewUser && (
          <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
            <DialogContent className="max-w-7xl">
              <DialogHeader>
                <DialogTitle>
                  {currentUser?.role === "superadmin"
                    ? "Admin & Users Details"
                    : "Users Details"}{" "}
                </DialogTitle>
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
                      <TableHead className="text-center">
                        Total Entrires Created By Users
                      </TableHead>

                      <TableHead className="text-center">User Count</TableHead>
                      <TableHead className="text-center">Created At</TableHead>
                      <TableHead className="text-center">Action</TableHead>
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
                        {viewUser?.total_records_created_by_users}
                      </TableCell>
                      <TableCell className="text-center">
                        {viewUser.user_count}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(
                          viewUser.admin_created_at
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDonwloadCSV(viewUser?.admin_id)}
                        >
                          <FileDown color="green" size={23} />
                        </Button>
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
                          User Entrires Count
                        </TableHead>
                        <TableHead className="text-center">
                          Created At
                        </TableHead>

                        <TableHead className="text-center">
                          Download Excel
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
                            {u.record_count}
                          </TableCell>
                          <TableCell className="text-center">
                            {new Date(u.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              title="Download Excel"
                              onClick={() => handleDonwloadCSV(u)}
                            >
                              <FileDown color="green" size={23} />
                            </Button>
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
              <form
                spellCheck="false"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
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
