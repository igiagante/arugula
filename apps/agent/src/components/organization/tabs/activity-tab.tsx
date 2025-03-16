import { ActivityItem } from "@/components/organization/activity-item";
import { Activity } from "../types";

interface ActivityTabProps {
  activities: Activity[];
}

export function ActivityTab({ activities }: ActivityTabProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-medium text-black mb-6">Recent Activities</h3>
      <div className="space-y-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="pb-6 border-b border-gray-100 last:border-0"
          >
            <ActivityItem activity={activity} />
          </div>
        ))}
      </div>
    </div>
  );
}
