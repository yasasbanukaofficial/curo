import { Types } from "mongoose";
import type { TeamRole } from "./teamMember";

export interface ITeamInvite {
  teamId: Types.ObjectId;
  email: string;
  role: TeamRole;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
