export type TeamRole = "owner" | "admin" | "developer" | "viewer";
export type MemberStatus = "active" | "invited" | "suspended";

export interface TeamMember {
  _id: string;
  teamId: string;
  userId: string;
  name: string;
  email: string;
  role: TeamRole;
  status: MemberStatus;
  joinedAt: string;
  createdAt: string;
}
