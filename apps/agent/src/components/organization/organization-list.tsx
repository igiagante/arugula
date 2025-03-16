"use client";

import { Organization } from "@/lib/types";
import { Calendar, MoreHorizontal, Plus, Search, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrganizationSkeleton } from "./organization-skeleton";

export default function OrganizationList({
  organizations,
  isLoading = false,
}: {
  organizations: Organization[];
  isLoading?: boolean;
}) {
  const router = useRouter();
  // Refined monochromatic colors for better contrast and readability
  const minimalistColors = [
    "bg-gray-100 text-gray-900",
    "bg-slate-100 text-slate-900",
    "bg-zinc-100 text-zinc-900",
    "bg-stone-100 text-stone-900",
    "bg-neutral-100 text-neutral-900",
  ];

  const [activeOrgId, setActiveOrgId] = useState(organizations[0]?.id || "");
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const handleOrgClick = (orgId: string) => {
    setActiveOrgId(orgId);
    router.push(`/organizations/${orgId}`);
  };

  return (
    <div className="w-full bg-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-xl font-medium text-black">Organizations</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your workspace and teams
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 size-4" />
              <input
                type="text"
                placeholder="Find organization..."
                className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200 text-sm w-full border border-gray-200"
              />
            </div>

            <button className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
              <Plus className="size-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, index) => (
                <OrganizationSkeleton key={`skeleton-${index}`} />
              ))
          ) : (
            <>
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className={`relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden cursor-pointer ${
                    activeOrgId === org.id ? "shadow-sm" : ""
                  } hover:shadow-md hover:translate-y-[-2px] transition-all duration-300`}
                  onClick={() => handleOrgClick(org.id)}
                >
                  {activeOrgId === org.id && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                  )}

                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(
                            showDropdown === org.id ? null : org.id
                          );
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreHorizontal className="size-4 text-gray-500" />
                      </button>

                      {showDropdown === org.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-sm border border-gray-200 z-20 py-1 text-xs">
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-900">
                            Settings
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-900">
                            Members
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-gray-900">
                            Billing
                          </button>
                          <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center mb-4">
                      <div
                        className={`size-10 rounded-lg ${minimalistColors[Math.abs(org.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % minimalistColors.length]} flex items-center justify-center font-medium mr-3 border border-gray-200 overflow-hidden`}
                      >
                        {org.imageUrl ? (
                          <Image
                            src={org.imageUrl}
                            alt={org.name}
                            className="size-full object-cover"
                            width={40}
                            height={40}
                          />
                        ) : (
                          org.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="grow">
                        <h2 className="text-base font-medium text-black">
                          {org.name}
                        </h2>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {org.id}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 mt-3">
                      <div className="flex items-center text-xs text-gray-700">
                        <Users className="size-3.5mr-2 text-gray-500" />
                        <span>{org.membersCount} members</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-700">
                        <Calendar className="size-3.5mr-2 text-gray-500" />
                        <span>
                          <span className="text-gray-500">Created:</span>{" "}
                          <span className="font-medium">
                            {new Date(org.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-black scale-x-0 group-hover:scale-x-100 transition duration-200 origin-left"></div>
                </div>
              ))}

              <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center p-5 cursor-pointer hover:border-gray-400 hover:bg-gray-100 transition-colors duration-200 min-h-[165px]">
                <div className="text-center">
                  <div className="size-8 rounded-full bg-white border border-gray-300 flex items-center justify-center mx-auto mb-2">
                    <Plus className="size-4 text-gray-700" />
                  </div>
                  <h3 className="text-sm font-medium text-black">
                    New Organization
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Create a workspace
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
