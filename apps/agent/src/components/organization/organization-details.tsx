"use client";

import { useState } from "react";

import { CacheTags, createDynamicTag } from "@/app/(main)/api/tags";
import { mapClerkOrganization } from "@/lib/mappers/organization";
import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { OrganizationAvatar } from "./organization-avatar";
import { MembersTab } from "./tabs/members-tab";
import { OverviewTab } from "./tabs/overview-tab";
import { SettingsTab } from "./tabs/settings-tab";

export default function OrganizationDetails() {
  const { organization: clerkOrg, isLoaded } = useOrganization();

  const { data: members } = useQuery({
    queryKey: [createDynamicTag(CacheTags.organizationMembers, clerkOrg?.id!)],
    queryFn: async () => {
      const response = await fetch(
        `/api/organizations/${clerkOrg?.id}/members`
      );
      return response.json();
    },
    enabled: !!clerkOrg?.id,
  });

  const [activeTab, setActiveTab] = useState("overview");

  if (!isLoaded) return <div>Loading...</div>;
  if (!clerkOrg) return <div>No organization found</div>;

  const organization = mapClerkOrganization(clerkOrg);

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab organization={organization} />;
      case "members":
        return <MembersTab members={members} />;
      case "settings":
        return <SettingsTab organization={organization} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-[calc(100dvh-65px)] p-4 sm:p-8">
      <div
        className="w-full mx-auto 
        max-w-[780px] lg:max-w-2xl xl:max-w-4xl
        min-w-0 sm:min-w-[480px] md:min-w-[780px]"
      >
        {/* Back button and header */}
        <div className="mb-6">
          <div className="flex items-center mt-4 gap-2">
            {organization.imageUrl ? (
              <OrganizationAvatar org={organization} className="size-8" />
            ) : (
              <div className="size-10 rounded-lg bg-gray-100 text-gray-900 flex items-center justify-center font-medium mr-3 border border-gray-200">
                {organization.name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <h1 className="text-xl font-medium text-black">
              {organization.name}
            </h1>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm border-b-2 ${activeTab === "overview" ? "border-black text-black" : "border-transparent text-gray-600 hover:text-black"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-sm border-b-2 ${activeTab === "members" ? "border-black text-black" : "border-transparent text-gray-600 hover:text-black"}`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          <button
            className={`px-4 py-2 text-sm border-b-2 ${activeTab === "settings" ? "border-black text-black" : "border-transparent text-gray-600 hover:text-black"}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        {/* Tab content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
