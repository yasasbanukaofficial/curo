import { Types } from "mongoose";

export type TeamRole = "owner" | "admin" | "developer" | "viewer";
export type MemberStatus = "active" | "invited" | "suspended";

export interface ITeamMember {
  teamId: Types.ObjectId;
  userId: Types.ObjectId;
  role: TeamRole;
  status: MemberStatus;
  joinedAt?: Date;
  createdAt: Date;
}
