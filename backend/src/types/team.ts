import { Types } from "mongoose";

export type TeamPlan = "starter" | "team" | "enterprise";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "incomplete";

export interface ITeam {
  name: string;
  slug: string;
  avatarUrl?: string;
  ownerId: Types.ObjectId;
  plan: TeamPlan;
  billingEmail?: string;
  subscriptionStatus: SubscriptionStatus;
  enforce2fa: boolean;
  allowedDomains: string[];
  createdAt: Date;
  updatedAt: Date;
}
