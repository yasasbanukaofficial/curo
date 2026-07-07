import type { TeamMember } from "./teamMember";
import type { TeamInvite } from "./teamInvite";

export interface Team {
  _id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  ownerId: string;
  enforce2fa: boolean;
  allowedDomains: string[];
  memberCount: number;
  members: TeamMember[];
  invites: TeamInvite[];
  projects: string[];
  createdAt: string;
  updatedAt: string;
}
