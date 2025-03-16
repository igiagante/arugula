"use client";

import OrganizationList from "@/components/organization/organization-list";
import { useOrganizations } from "@/hooks/use-organization";
import { Loader2 } from "lucide-react";

export default function OrganizationsPage() {
  const { data: organizations = [], isLoading } = useOrganizations();

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="w-12 h-12 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500 text-lg">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return <OrganizationList organizations={organizations} />;
}
