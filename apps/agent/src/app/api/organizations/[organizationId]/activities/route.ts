import { mapClerkUser } from "@/lib/mappers/user";
import { clerkClient, OrganizationMembership } from "@clerk/nextjs/server";
import { formatDistanceToNow } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ organizationId: string }> }
) {
  try {
    const clerk = await clerkClient();
    const memberships = await clerk.organizations.getOrganizationMembershipList(
      {
        organizationId: (await params).organizationId,
      }
    );

    // Convert recent membership changes to activities
    const activities = memberships.data.map(
      async (membership: OrganizationMembership) => {
        const user = await clerk.users.getUser(
          membership.publicUserData?.userId || ""
        );

        const { name, initials, avatar } = mapClerkUser(user);

        return {
          id: membership.id,
          action:
            membership.role === "admin"
              ? "became an organization admin"
              : "joined the organization",
          timestamp: formatDistanceToNow(new Date(membership.createdAt), {
            addSuffix: true,
          }),
          user: {
            id: membership.publicUserData?.userId || "",
            name,
            avatar,
            initials,
          },
        };
      }
    );

    // Resolve promises first, then sort
    const resolvedActivities = await Promise.all(activities);
    resolvedActivities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(resolvedActivities);
  } catch (error) {
    console.error("Failed to fetch organization activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
