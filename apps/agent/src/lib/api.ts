// This is a mock API implementation
// In a real application, you would replace these with actual API calls

import type { Member, Organization, OrganizationDetails } from "./types";

// Simulated delay to mimic API latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "Acme Inc",
    subdomain: "acme",
    createdAt: "2023-01-15T00:00:00Z",
    membersCount: 8,
    adminsCount: 2,
    pendingInvites: 3,
    lastActivityDate: "2023-07-20T14:30:00Z",
  },
  {
    id: "org-2",
    name: "Globex Corporation",
    subdomain: "globex",
    createdAt: "2023-03-10T00:00:00Z",
    membersCount: 12,
    adminsCount: 3,
    pendingInvites: 1,
    lastActivityDate: "2023-07-18T09:15:00Z",
  },
  {
    id: "org-3",
    name: "Initech",
    subdomain: "initech",
    createdAt: "2023-05-22T00:00:00Z",
    membersCount: 5,
    adminsCount: 1,
    pendingInvites: 2,
    lastActivityDate: "2023-07-15T16:45:00Z",
  },
];

const mockMembers: Record<string, Member[]> = {
  "org-1": [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2023-01-15T00:00:00Z",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2023-01-16T00:00:00Z",
    },
    {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "member",
      status: "active",
      joinedAt: "2023-02-01T00:00:00Z",
    },
    {
      id: "user-4",
      name: "Alice Brown",
      email: "alice@example.com",
      role: "member",
      status: "pending",
      joinedAt: "2023-07-10T00:00:00Z",
    },
  ],
  "org-2": [
    {
      id: "user-5",
      name: "Michael Scott",
      email: "michael@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2023-03-10T00:00:00Z",
    },
    {
      id: "user-6",
      name: "Dwight Schrute",
      email: "dwight@example.com",
      role: "member",
      status: "active",
      joinedAt: "2023-03-11T00:00:00Z",
    },
  ],
  "org-3": [
    {
      id: "user-7",
      name: "Peter Gibbons",
      email: "peter@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2023-05-22T00:00:00Z",
    },
    {
      id: "user-8",
      name: "Michael Bolton",
      email: "michael.b@example.com",
      role: "member",
      status: "active",
      joinedAt: "2023-05-23T00:00:00Z",
    },
  ],
};

// Update the mockActivities declaration with proper typing
const mockActivities: Record<
  string,
  Array<{
    id: string;
    action: string;
    timestamp: string;
    details: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }>
> = {
  "org-1": [
    {
      id: "activity-1",
      action: "added a new member",
      timestamp: "2023-07-10T14:30:00Z",
      details: "Added Alice Brown as a member",
      user: {
        id: "user-1",
        name: "John Doe",
        avatar: "/placeholder-user.jpg",
      },
    },
    {
      id: "activity-2",
      action: "updated organization settings",
      timestamp: "2023-07-05T09:15:00Z",
      details: "Changed organization name from 'Acme Corp' to 'Acme Inc'",
      user: {
        id: "user-2",
        name: "Jane Smith",
        avatar: "/placeholder-user.jpg",
      },
    },
  ],
  "org-2": [
    {
      id: "activity-3",
      action: "removed a member",
      timestamp: "2023-07-18T09:15:00Z",
      details: "Removed Jim Halpert from the organization",
      user: {
        id: "user-5",
        name: "Michael Scott",
        avatar: "/placeholder-user.jpg",
      },
    },
  ],
  "org-3": [
    {
      id: "activity-4",
      action: "changed member role",
      timestamp: "2023-07-15T16:45:00Z",
      details: "Changed Michael Bolton's role from admin to member",
      user: {
        id: "user-7",
        name: "Peter Gibbons",
        avatar: "/placeholder-user.jpg",
      },
    },
  ],
};

// API functions
export async function fetchOrganizations(): Promise<Organization[]> {
  try {
    await delay(800); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    return [...mockOrganizations];
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw new Error("Failed to fetch organizations. Please try again.");
  }
}

export async function fetchOrganizationDetails(
  orgId: string
): Promise<OrganizationDetails> {
  try {
    console.log("fetching org details", orgId);
    await delay(1000); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const org = mockOrganizations.find((o) => o.id === orgId);
    if (!org) {
      throw new Error("Organization not found");
    }

    console.log(org);

    return {
      ...org,
      description: "This is a sample organization description.",
      members: mockMembers[orgId] || [],
      activities: mockActivities[orgId] || [],
    };
  } catch (error) {
    console.error(`Error fetching organization details for ${orgId}:`, error);
    throw new Error("Failed to fetch organization details. Please try again.");
  }
}

export async function createOrganization(data: {
  name: string;
  subdomain: string;
  description: string;
}): Promise<Organization> {
  try {
    await delay(1200); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: data.name,
      subdomain: data.subdomain,
      createdAt: new Date().toISOString(),
      membersCount: 1,
      adminsCount: 1,
      pendingInvites: 0,
      lastActivityDate: new Date().toISOString(),
    };

    // In a real app, you would save this to your database
    mockOrganizations.push(newOrg);

    return newOrg;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw new Error("Failed to create organization. Please try again.");
  }
}

export async function updateOrganization(
  orgId: string,
  data: { name: string; subdomain: string; description: string }
): Promise<OrganizationDetails> {
  try {
    await delay(1000); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const orgIndex = mockOrganizations.findIndex((o) => o.id === orgId);
    if (orgIndex === -1) {
      throw new Error("Organization not found");
    }

    // Update the organization
    mockOrganizations[orgIndex] = {
      ...mockOrganizations[orgIndex],
      id: mockOrganizations[orgIndex]?.id || "",
      createdAt: mockOrganizations[orgIndex]?.createdAt || "",
      membersCount: mockOrganizations[orgIndex]?.membersCount || 0,
      adminsCount: mockOrganizations[orgIndex]?.adminsCount || 0,
      pendingInvites: mockOrganizations[orgIndex]?.pendingInvites || 0,
      lastActivityDate: mockOrganizations[orgIndex]?.lastActivityDate || "",
      name: data.name,
      subdomain: data.subdomain,
    };

    // Return the updated organization details
    return {
      ...mockOrganizations[orgIndex],
      description: data.description,
      members: mockMembers[orgId] || [],
      activities: mockActivities[orgId] || [],
    };
  } catch (error) {
    console.error(`Error updating organization ${orgId}:`, error);
    throw new Error("Failed to update organization. Please try again.");
  }
}

export async function deleteOrganization(orgId: string): Promise<void> {
  try {
    await delay(1500); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const orgIndex = mockOrganizations.findIndex((o) => o.id === orgId);
    if (orgIndex === -1) {
      throw new Error("Organization not found");
    }

    // Remove the organization
    mockOrganizations.splice(orgIndex, 1);

    // In a real app, you would also clean up related data
    delete mockMembers[orgId];
    delete mockActivities[orgId];
  } catch (error) {
    console.error(`Error deleting organization ${orgId}:`, error);
    throw new Error("Failed to delete organization. Please try again.");
  }
}

export async function addMember(
  orgId: string,
  data: { name: string; email: string; role: string }
): Promise<Member> {
  try {
    await delay(1000); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const newMember: Member = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "pending",
      joinedAt: new Date().toISOString(),
    };

    // Initialize members array if it doesn't exist
    if (!mockMembers[orgId]) {
      mockMembers[orgId] = [];
    }

    // Add the new member
    mockMembers[orgId].push(newMember);

    // Update organization counts
    const org = mockOrganizations.find((o) => o.id === orgId);
    if (org) {
      org.membersCount += 1;
      if (data.role === "admin") {
        org.adminsCount += 1;
      }
      org.pendingInvites += 1;
      org.lastActivityDate = new Date().toISOString();
    }

    return newMember;
  } catch (error) {
    console.error(`Error adding member to organization ${orgId}:`, error);
    throw new Error("Failed to add member. Please try again.");
  }
}

export async function updateMember(
  orgId: string,
  memberId: string,
  data: { role: string }
): Promise<Member> {
  try {
    await delay(800); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const members = mockMembers[orgId];
    if (!members) {
      throw new Error("Organization not found");
    }

    const memberIndex = members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new Error("Member not found");
    }

    const oldRole = members[memberIndex]?.role;
    const newRole = data.role;

    // Update the member
    members[memberIndex] = {
      ...members[memberIndex],
      id: members[memberIndex]?.id || "",
      name: members[memberIndex]?.name || "",
      email: members[memberIndex]?.email || "",
      status: members[memberIndex]?.status || "pending",
      joinedAt: members[memberIndex]?.joinedAt || "",
      role: newRole,
    };

    // Update organization counts if role changed
    if (oldRole !== newRole) {
      const org = mockOrganizations.find((o) => o.id === orgId);
      if (org) {
        if (oldRole === "admin" && newRole !== "admin") {
          org.adminsCount -= 1;
        } else if (oldRole !== "admin" && newRole === "admin") {
          org.adminsCount += 1;
        }
        org.lastActivityDate = new Date().toISOString();
      }
    }

    return members[memberIndex];
  } catch (error) {
    console.error(
      `Error updating member ${memberId} in organization ${orgId}:`,
      error
    );
    throw new Error("Failed to update member. Please try again.");
  }
}

export async function removeMember(
  orgId: string,
  memberId: string
): Promise<void> {
  try {
    await delay(800); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const members = mockMembers[orgId];
    if (!members) {
      throw new Error("Organization not found");
    }

    const memberIndex = members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new Error("Member not found");
    }

    const removedMember = members[memberIndex];

    // Remove the member
    members.splice(memberIndex, 1);

    // Update organization counts
    const org = mockOrganizations.find((o) => o.id === orgId);
    if (org) {
      org.membersCount -= 1;
      if (removedMember?.role === "admin") {
        org.adminsCount -= 1;
      }
      if (removedMember?.status === "pending") {
        org.pendingInvites -= 1;
      }
      org.lastActivityDate = new Date().toISOString();
    }
  } catch (error) {
    console.error(
      `Error removing member ${memberId} from organization ${orgId}:`,
      error
    );
    throw new Error("Failed to remove member. Please try again.");
  }
}

export async function resendInvite(
  orgId: string,
  memberId: string
): Promise<void> {
  try {
    await delay(600); // Simulate network delay

    // Simulate potential errors
    if (Math.random() < 0.1) {
      throw new Error("Network error");
    }

    const members = mockMembers[orgId];
    if (!members) {
      throw new Error("Organization not found");
    }

    const memberIndex = members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new Error("Member not found");
    }

    if (members[memberIndex]?.status !== "pending") {
      throw new Error("Member is not in pending status");
    }

    // In a real app, you would send an email here
    console.log(`Resent invite to ${members[memberIndex].email}`);
  } catch (error) {
    console.error(
      `Error resending invite to member ${memberId} in organization ${orgId}:`,
      error
    );
    throw new Error("Failed to resend invite. Please try again.");
  }
}
