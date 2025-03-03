"use client";

import type { Activity } from "@/lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface OrganizationActivityProps {
  activities: Activity[];
}

export function OrganizationActivity({
  activities,
}: OrganizationActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Recent actions and changes in this organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recent activity
            </p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <Avatar className="size-9 mr-4">
                  <AvatarImage
                    src={activity.user.avatar}
                    alt={activity.user.name}
                  />
                  <AvatarFallback>
                    {activity.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold">{activity.user.name}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                  {activity.details && (
                    <p className="text-sm mt-2 text-muted-foreground">
                      {activity.details}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
