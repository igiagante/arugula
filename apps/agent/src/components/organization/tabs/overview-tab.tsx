import { ActivityItem } from "@/components/organization/activity-item";
import { StatCard } from "@/components/organization/stat-card";
import { Activity, Organization } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { Calendar, ExternalLink, Shield, Users } from "lucide-react";

export function OverviewTab({ organization }: { organization: Organization }) {
  const { data: activities } = useQuery({
    queryKey: ["organization-activities", organization?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/organizations/${organization?.id}/activities`
      );
      return response.json();
    },
    enabled: !!organization?.id,
  });

  const createdAt = formatDistance(
    new Date(organization.createdAt),
    new Date(),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stats cards */}
        <StatCard
          title="MEMBERS"
          value={organization.membersCount}
          icon={Users}
        />
        <StatCard
          title="PLAN"
          value={organization.plan || "Free"}
          icon={Shield}
        />
        <StatCard title="CREATED" value={createdAt} icon={Calendar} />
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
          {activities?.slice(0, 3).map((activity: Activity) => (
            <ActivityItem
              key={activity.id}
              activity={{
                ...activity,
                user: activity.user.name,
                time: activity.timestamp,
              }}
            />
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
            <span className="text-sm text-gray-700">
              {`${organization.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
                "No domain set"}
            </span>
          </div>
          <span className="text-xs py-1 px-2 bg-green-100 text-green-800 rounded">
            {organization.slug ? "Verified" : "Unverified"}
          </span>
        </div>
      </div>
    </div>
  );
}
