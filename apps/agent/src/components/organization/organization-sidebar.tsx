"use client";

import { useOrganizations } from "@/hooks/use-organization";
import type { Organization } from "@/lib/types";
import { useClerk, useOrganization, useUser } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { Building2, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { OrganizationAvatar } from "./organization-avatar";

export function OrganizationSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { open } = useSidebar();
  const { user } = useUser();
  const { organization } = useOrganization();
  const { openCreateOrganization, setActive } = useClerk();
  const [searchQuery, _setSearchQuery] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const { data: organizations = [], isLoading } = useOrganizations();

  const isAdmin = useMemo(() => {
    if (!user) return false;
    return user.organizationMemberships.some(
      (membership) => membership.role === "org:admin"
    );
  }, [user]);

  useEffect(() => {
    if (organizations.length === 0) return;

    // Extract org ID from the URL
    const orgIdMatch = pathname.match(/\/organizations\/(org_[^/]+)/);
    const urlOrgId = orgIdMatch ? orgIdMatch[1] : null;

    // Find organization based on URL or Clerk organization
    const orgToSelect = urlOrgId
      ? organizations.find((org) => org.id === urlOrgId)
      : organization
        ? organizations.find((org) => org.id === organization.id)
        : organizations[0];

    setSelectedOrg(orgToSelect || null);
  }, [organizations, organization, pathname]);

  // Memoize filtered organizations
  const filteredOrganizations = useMemo(
    () =>
      organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [organizations, searchQuery]
  );

  const handleOrgSelect = async (org: Organization) => {
    if (org.id === selectedOrg?.id) return;

    setIsChanging(true);
    setSelectedOrg(org); // Update UI immediately

    try {
      // Update Clerk organization first
      await setActive({ organization: org.id });
      // Then navigate
      await router.push(`/grows`);
    } catch (error) {
      console.error("Failed to switch organization:", error);
      setSelectedOrg(selectedOrg); // Revert on error
    } finally {
      setIsChanging(false);
      router.refresh();
    }
  };

  const handleCreateOrganization = () => {
    openCreateOrganization({
      afterCreateOrganizationUrl: "/organizations",
    });
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
            {selectedOrg ? (
              <OrganizationAvatar org={selectedOrg} />
            ) : (
              <Building2 className="size-4" />
            )}
          </Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isChanging}>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                {selectedOrg ? (
                  <OrganizationAvatar org={selectedOrg} />
                ) : (
                  <Building2 className="size-2" />
                )}
                <span>
                  {isLoading || isChanging
                    ? "Loading..."
                    : filteredOrganizations.length === 0
                      ? "No organizations yet"
                      : selectedOrg?.name || "Select Organization"}
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
            ) : filteredOrganizations.length === 0 ? (
              <div className="px-2 py-4">
                <div className="text-sm text-muted-foreground mb-2">
                  No organizations yet
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleCreateOrganization}
                >
                  Create Organization
                </Button>
              </div>
            ) : (
              <>
                {filteredOrganizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => handleOrgSelect(org)}
                    className="cursor-pointer"
                  >
                    <OrganizationAvatar org={org} className="mr-2" />
                    <span>{org.name}</span>
                  </DropdownMenuItem>
                ))}
                {isAdmin && (
                  <>
                    <div className="px-2 py-1">
                      <div className="h-px bg-border" />
                    </div>
                    <DropdownMenuItem
                      onClick={handleCreateOrganization}
                      className="cursor-pointer gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="size-4" />
                      <span>New Organization</span>
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
