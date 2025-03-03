"use client";

import { fetchOrganizations } from "@/lib/api";
import type { Organization } from "@/lib/types";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { Building2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function OrganizationSidebar() {
  const router = useRouter();
  const { open } = useSidebar();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchOrganizations();
        setOrganizations(data);
        // Set the first organization as selected by default if available
        if (data.length > 0 && !selectedOrg) {
          setSelectedOrg(data[0] || null);
        }
      } catch (err) {
        console.error("Failed to fetch organizations:", err);
        setError("Failed to load organizations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizations();
  }, [selectedOrg]);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);
    router.push(`/organizations/${org.id}`);
  };

  return (
    <div>
      {!open ? (
        <Button
          variant="ghost"
          size="icon"
          className={cn("w-full h-9", selectedOrg && "hover:bg-muted")}
          asChild
        >
          <Link href={selectedOrg ? `/organizations/${selectedOrg.id}` : "#"}>
            <Building2 className="size-4" />
          </Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="size-2" />
                <span>
                  {isLoading
                    ? "Loading..."
                    : error
                      ? "Error"
                      : selectedOrg
                        ? selectedOrg.name
                        : "Select Organization"}
                </span>
              </div>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {isLoading ? (
              <div className="px-2 py-4 text-sm text-muted-foreground">
                Loading organizations...
              </div>
            ) : error ? (
              <div className="px-2 py-4 text-sm text-red-500">{error}</div>
            ) : filteredOrganizations.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground">
                {searchQuery
                  ? "No organizations found"
                  : "No organizations yet"}
              </div>
            ) : (
              filteredOrganizations.map((org) => (
                <DropdownMenuItem
                  key={org.id}
                  onClick={() => handleOrgSelect(org)}
                  className="cursor-pointer"
                >
                  <Building2 className="mr-2 size-4" />
                  <span>{org.name}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
