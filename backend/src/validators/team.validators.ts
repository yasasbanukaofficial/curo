import { z } from "zod/v3";

const teamRoleEnum = z.enum(["owner", "admin", "developer", "viewer"]);
const teamPlanEnum = z.enum(["starter", "team", "enterprise"]);
const subscriptionStatusEnum = z.enum(["trialing", "active", "past_due", "canceled", "incomplete"]);
const memberStatusEnum = z.enum(["active", "invited", "suspended"]);

export const createTeamSchema = z.object({
  name: z.string().trim().min(1, "Team name is required").max(100),
  slug: z.string().trim().min(1, "Team slug is required").max(100).toLowerCase(),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  plan: teamPlanEnum.optional(),
  billingEmail: z.string().email("Invalid billing email").optional().or(z.literal("")),
  subscriptionStatus: subscriptionStatusEnum.optional(),
  enforce2fa: z.boolean().optional(),
  allowedDomains: z.array(z.string().trim().toLowerCase()).optional(),
  emails: z.array(z.object({
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    role: teamRoleEnum.optional(),
  })).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  slug: z.string().trim().min(1).max(100).toLowerCase().optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional().or(z.literal("")),
  plan: teamPlanEnum.optional(),
  billingEmail: z.string().email("Invalid billing email").optional().or(z.literal("")),
  subscriptionStatus: subscriptionStatusEnum.optional(),
  enforce2fa: z.boolean().optional(),
  allowedDomains: z.array(z.string().trim().toLowerCase()).optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: teamRoleEnum.optional(),
});

export const updateMemberSchema = z.object({
  role: teamRoleEnum.optional(),
  status: memberStatusEnum.optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  role: teamRoleEnum.optional(),
});

export const createTeamMemberSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  role: teamRoleEnum.optional(),
  status: memberStatusEnum.optional(),
});

export const teamIdParamSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
});

export const memberIdParamSchema = z.object({
  memberId: z.string().min(1, "Member ID is required"),
});

export const inviteIdParamSchema = z.object({
  inviteId: z.string().min(1, "Invite ID is required"),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
