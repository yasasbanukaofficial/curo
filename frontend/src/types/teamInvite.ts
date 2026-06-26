import type { TeamRole } from "./teamMember";

export interface TeamInvite {
  _id: string;
  teamId: string;
  email: string;
  role: TeamRole;
  token: string;
  expiresAt: string;
  createdAt: string;
}
