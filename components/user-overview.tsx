"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Calendar } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UserOverview() {
  const { currentUser, getUsersByAdmin, dataEntries, getDataEntriesByUser } =
    useAuthStore();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [viewUserEntries, setViewUserEntries] = useState(false);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const myUsers = getUsersByAdmin(currentUser.id);

  const handleViewUserEntries = (user: any) => {
    setSelectedUser(user);
    setViewUserEntries(true);
  };

  const selectedUserEntries = selectedUser
    ? getDataEntriesByUser(selectedUser.id)
    : [];

  return (
    <div className="space-y-6">
      {/* <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
          <CardDescription>Detailed view of all users you manage ({myUsers.length}/5 users created)</CardDescription>
        </CardHeader>
        <CardContent>
          {myUsers.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Users Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't created any users yet. You can create up to 5 users.
              </p>
              <Button onClick={() => (window.location.href = "/users")}>Create Your First User</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Last Entry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myUsers.map((user) => {
                  const userEntries = getDataEntriesByUser(user.id)
                  const lastEntry = userEntries.sort(
                    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
                  )[0]

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{userEntries.length}</span>
                          <span className="text-sm text-muted-foreground">entries</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lastEntry ? (
                          <div>
                            <p className="text-sm font-medium truncate max-w-32">{lastEntry.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(lastEntry.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No entries</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={userEntries.length > 0 ? "default" : "secondary"}>
                          {userEntries.length > 0 ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUserEntries(user)}
                          disabled={userEntries.length === 0}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Entries
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card> */}

      {/* User Entries Dialog */}
      <Dialog open={viewUserEntries} onOpenChange={setViewUserEntries}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedUser?.name}'s Data Entries</DialogTitle>
            <DialogDescription>
              All data entries created by {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {selectedUserEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                This user hasn't created any entries yet.
              </p>
            ) : (
              <div className="space-y-4">
                {selectedUserEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {entry.image && (
                        <img
                          src={entry.image || "/placeholder.svg"}
                          alt={entry.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{entry.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {entry.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Created:{" "}
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                          {entry.updated_at !== entry.created_at && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Updated:{" "}
                              {new Date(entry.updated_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
