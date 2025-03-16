import { ActivityItem } from "@/components/organization/activity-item";
import { StatCard } from "@/components/organization/stat-card";
import { Activity, Organization } from "@/components/organization/types";
import { Calendar, ExternalLink, Shield, Users } from "lucide-react";

interface OverviewTabProps {
  organization: Organization;
  activities: Activity[];
}

export function OverviewTab({ organization, activities }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stats cards */}
        <StatCard title="MEMBERS" value={organization.members} icon={Users} />
        <StatCard title="PLAN" value={organization.plan} icon={Shield} />
        <StatCard
          title="CREATED"
          value={organization.createdAt}
          icon={Calendar}
        />
      </div>

      {/* Recent activity section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-black">Recent Activity</h3>
          <button className="text-xs text-gray-500 hover:text-black transition-colors">
            View all
          </button>
        </div>
        <div className="space-y-4">
          {activities.slice(0, 3).map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>

      {/* Domain section */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="text-sm font-medium text-black mb-4">
          Domain Information
        </h3>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <ExternalLink className="size-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{organization.domain}</span>
          </div>
          <span className="text-xs py-1 px-2 bg-green-100 text-green-800 rounded">
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}
