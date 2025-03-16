// hooks/useOrganizations.ts
import type { Organization } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useOrganizations() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["organizations", user?.id],
    queryFn: async (): Promise<Organization[]> => {
      if (!user) {
        toast.error("Please sign in to view organizations.");
        return [];
      }

      try {
        return user.organizationMemberships.map((org) => ({
          id: org.organization.id,
          name: org.organization.name,
          slug: org.organization.slug,
          subdomain: org.organization.slug || "",
          createdAt: new Date().toISOString(),
          membersCount: org.organization.membersCount || 0,
          adminsCount: 0,
          pendingInvites: 0,
          lastActivityDate: new Date().toISOString(),
          imageUrl: org.organization.imageUrl,
        }));
      } catch (err) {
        console.error("Failed to process organizations:", err);
        toast.error("Failed to load organizations. Please try again.");
        return [];
      }
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
