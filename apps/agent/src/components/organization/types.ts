export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  members: number;
  plan: string;
  domain: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
  avatar: string;
  initials: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
}
