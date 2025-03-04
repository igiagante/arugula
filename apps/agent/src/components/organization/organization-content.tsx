"use client";

import { fetchOrganizationDetails } from "@/lib/api";
import { OrganizationDetails } from "@/lib/types";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { OrganizationActivity } from "./organization-activity";
import { OrganizationMembers } from "./organization-members";
import { OrganizationOverview } from "./organization-overview";
import { OrganizationSettings } from "./organization-settings";

export function OrganizationContent({ orgId }: { orgId: string }) {
  const [orgDetails, setOrgDetails] = useState<OrganizationDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedOrgId = orgId;

  useEffect(() => {
    if (!selectedOrgId) {
      setOrgDetails(null);
      return;
    }

    const loadOrgDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchOrganizationDetails(selectedOrgId);
        setOrgDetails(data);
      } catch (err) {
        console.error("Failed to fetch organization details:", err);
        setError("Failed to load organization details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrgDetails();
  }, [selectedOrgId]);

  if (!selectedOrgId) {
    return (
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Multi-Tenant Organization Management</CardTitle>
            <CardDescription>
              Select an organization from the sidebar or create a new one to get
              started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">
              This dashboard allows you to manage multiple organizations in your
              multi-tenant application.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 p-6">
        <Skeleton className="h-[50px] w-[300px] mb-4" />
        <Skeleton className="h-[20px] w-[250px] mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!orgDetails) {
    return null;
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{orgDetails.name}</h1>
        <p className="text-muted-foreground">
          {orgDetails.subdomain}.example.com
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OrganizationOverview organization={orgDetails} />
        </TabsContent>

        <TabsContent value="members">
          <OrganizationMembers
            organizationId={selectedOrgId}
            members={orgDetails.members}
            onMembersChange={(updatedMembers) => {
              setOrgDetails((prev) =>
                prev ? { ...prev, members: updatedMembers } : null
              );
            }}
          />
        </TabsContent>

        <TabsContent value="activity">
          <OrganizationActivity activities={orgDetails.activities} />
        </TabsContent>

        <TabsContent value="settings">
          <OrganizationSettings
            organization={orgDetails}
            onOrganizationUpdated={(updatedOrg) => {
              setOrgDetails(updatedOrg);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
