"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserRecord {
  user_id: number;
  user_name: string;
  record_count: number;
}

interface UserRecordsChartProps {
  data: UserRecord[];
}

export function UserRecordsChart({ data }: UserRecordsChartProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Individual user record counts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...data]
              .sort((a, b) => b.record_count - a.record_count)
              .map((user) => (
                <div
                  key={user?.user_id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user?.user_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.user_name}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {user?.user_id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {user?.record_count}
                    </div>
                    <div className="text-xs text-muted-foreground">records</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
