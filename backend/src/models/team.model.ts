import { model, Schema } from "mongoose";
import { ITeam } from "../types/team";

const _teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      maxlength: [100, "Team name must be at most 100 characters"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Team slug is required"],
      unique: true,
      maxlength: [100, "Team slug must be at most 100 characters"],
      trim: true,
      lowercase: true,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
    },
    plan: {
      type: String,
      enum: ["starter", "team", "enterprise"],
      default: "starter",
    },
    billingEmail: {
      type: String,
      required: false,
      trim: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ["trialing", "active", "past_due", "canceled", "incomplete"],
      default: "trialing",
    },
    enforce2fa: {
      type: Boolean,
      default: false,
    },
    allowedDomains: {
      type: [String],
      default: [],
    },
    projects: {
      type: [{ type: Schema.Types.ObjectId, ref: "Project" }],
      default: [],
    },
  },
  { timestamps: true },
);

export const TeamModel = model<ITeam>("Team", _teamSchema);
