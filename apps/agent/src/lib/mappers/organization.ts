import type { Organization } from "@/lib/types";
import type { useOrganization } from "@clerk/nextjs";

export function mapClerkOrganization(
  org: NonNullable<ReturnType<typeof useOrganization>["organization"]>
): Organization {
  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    subdomain: org.slug || "",
    createdAt: new Date(org.createdAt).toISOString(),
    membersCount: org.membersCount || 0,
    adminsCount: 0,
    pendingInvites: 0,
    lastActivityDate: new Date().toISOString(),
    imageUrl: org.imageUrl,
    plan: (org.publicMetadata as { plan?: string })?.plan || "Free",
  };
}
