"use client";

import type { OrganizationDetails } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Clock, Shield, UserPlus, Users } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OrganizationOverviewProps {
  organization: OrganizationDetails;
}

export function OrganizationOverview({
  organization,
}: OrganizationOverviewProps) {
  const stats = [
    {
      title: "Total Members",
      value: organization.members.length,
      icon: Users,
      description: "Active members in organization",
    },
    {
      title: "Admins",
      value: organization.members.filter((m) => m.role === "admin").length,
      icon: Shield,
      description: "Members with admin privileges",
    },
    {
      title: "Pending Invites",
      value: organization.pendingInvites,
      icon: UserPlus,
      description: "Invitations awaiting response",
    },
    {
      title: "Last Activity",
      value: new Date(organization.lastActivityDate).toLocaleDateString(),
      icon: Clock,
      description: "Most recent organization activity",
    },
  ];

  // Sample growth data - in a real app, this would come from the API
  const growthData = [
    { month: "Jan", members: 4 },
    { month: "Feb", members: 6 },
    { month: "Mar", members: 8 },
    { month: "Apr", members: 10 },
    { month: "May", members: 12 },
    { month: "Jun", members: 16 },
    { month: "Jul", members: organization.members.length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Growth</CardTitle>
          <CardDescription>
            Organization growth over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Organization Name
              </dt>
              <dd className="text-base">{organization.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Subdomain
              </dt>
              <dd className="text-base">
                {organization.subdomain}.example.com
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Created On
              </dt>
              <dd className="text-base">
                {new Date(organization.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Description
              </dt>
              <dd className="text-base">
                {organization.description || "No description provided"}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
