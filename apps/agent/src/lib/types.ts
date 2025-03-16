export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  subdomain: string;
  createdAt: string;
  membersCount: number;
  adminsCount: number;
  pendingInvites: number;
  lastActivityDate: string;
  imageUrl?: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending";
  joinedAt: string;
}

export interface Activity {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface OrganizationDetails {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  createdAt: string;
  lastActivityDate: string;
  pendingInvites: number;
  members: Member[];
  activities: Activity[];
}
