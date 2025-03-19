import { Activity, Member, Organization } from "./types";

// Mock organization data
export const organization: Organization = {
  id: "org_25x92fhz",
  name: "Acme Corporation",
  createdAt: "February 10, 2025",
  members: 16,
  plan: "Business",
  domain: "acmecorp.com",
};

// Mock members data
export const members: Member[] = [
  {
    id: "user_1",
    name: "Alex Johnson",
    email: "alex@acmecorp.com",
    role: "Admin",
    joined: "Feb 10, 2025",
    avatar: "AJ",
    initials: "AJ",
  },
  {
    id: "user_2",
    name: "Sarah Miller",
    email: "sarah@acmecorp.com",
    role: "Member",
    joined: "Feb 12, 2025",
    avatar: "SM",
    initials: "SM",
  },
  {
    id: "user_3",
    name: "David Chen",
    email: "david@acmecorp.com",
    role: "Member",
    joined: "Feb 15, 2025",
    avatar: "DC",
    initials: "DC",
  },
  {
    id: "user_4",
    name: "Emma Wilson",
    email: "emma@acmecorp.com",
    role: "Admin",
    joined: "Feb 18, 2025",
    avatar: "EW",
    initials: "EW",
  },
];

// Mock activity data
export const activities: Activity[] = [
  {
    id: "act_1",
    user: "Alex Johnson",
    action: "added Sarah Miller to the organization",
    time: "2 days ago",
  },
  {
    id: "act_2",
    user: "Emma Wilson",
    action: "updated organization settings",
    time: "5 days ago",
  },
  {
    id: "act_3",
    user: "David Chen",
    action: "created a new project",
    time: "1 week ago",
  },
  {
    id: "act_4",
    user: "Sarah Miller",
    action: "updated billing information",
    time: "2 weeks ago",
  },
];
