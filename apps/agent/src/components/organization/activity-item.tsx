import { Clock } from "lucide-react";
import { Activity } from "./types";

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="size-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs">
        {activity.user
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <div>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-black">{activity.user}</span>{" "}
          {activity.action}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          <Clock className="size-3 inline mr-1" />
          {activity.time}
        </p>
      </div>
    </div>
  );
}
