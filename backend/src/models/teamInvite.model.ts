import { model, Schema } from "mongoose";
import { ITeamInvite } from "../types/teamInvite";

const _teamInviteSchema = new Schema<ITeamInvite>(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team ID is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "developer", "viewer"],
      default: "developer",
    },
    token: {
      type: String,
      required: [true, "Token is required"],
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    invitedToSignup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const TeamInviteModel = model<ITeamInvite>("TeamInvite", _teamInviteSchema);
