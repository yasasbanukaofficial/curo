import type { TeamMember } from "./teamMember";
import type { TeamInvite } from "./teamInvite";

export type TeamPlan = "starter" | "team" | "enterprise";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled" | "incomplete";

export interface Team {
  _id: string;
  name: string;
  slug: string;
  avatarUrl?: string;
  ownerId: string;
  plan: TeamPlan;
  billingEmail?: string;
  subscriptionStatus: SubscriptionStatus;
  enforce2fa: boolean;
  allowedDomains: string[];
  memberCount: number;
  members: TeamMember[];
  invites: TeamInvite[];
  projects: string[];
  createdAt: string;
  updatedAt: string;
}
