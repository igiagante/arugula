import { mapClerkUser } from "@/lib/mappers/user";
import { clerkClient, OrganizationMembership } from "@clerk/nextjs/server";
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

    const memberPromises = memberships.data.map(
      async (membership: OrganizationMembership) => {
        // Fetch user data to get the metadata
        const user = await clerk.users.getUser(
          membership.publicUserData?.userId || ""
        );

        const { name, initials, avatar } = mapClerkUser(user);

        return {
          name,
          email: membership.publicUserData?.identifier || "",
          role: membership.role,
          joined: membership.createdAt,
          initials,
          avatar,
        };
      }
    );

    const members = await Promise.all(memberPromises);
    return NextResponse.json(members);
  } catch (error) {
    console.error("Failed to fetch organization activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
