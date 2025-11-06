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
                {selectedUserEntries.map((entry: any) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      {entry?.image && (
                        <img
                          src={entry?.image || "/placeholder.svg"}
                          alt={entry?.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{entry?.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {entry?.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Created:{" "}
                            {new Date(entry?.created_at).toLocaleDateString()}
                          </span>
                          {entry?.updated_at !== entry?.created_at && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Updated:{" "}
                              {new Date(entry?.updated_at).toLocaleDateString()}
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
