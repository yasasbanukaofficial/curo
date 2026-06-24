import { model, Schema } from "mongoose";
import { ITeamMember } from "../types/teamMember";

const _teamMemberSchema = new Schema<ITeamMember>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    role: {
      type: String,
      enum: ["owner", "admin", "developer", "viewer"],
      default: "developer",
    },
    status: {
      type: String,
      enum: ["active", "invited", "suspended"],
      default: "invited",
    },
    joinedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

_teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export const TeamMemberModel = model<ITeamMember>("TeamMember", _teamMemberSchema);
