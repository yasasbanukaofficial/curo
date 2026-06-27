import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { teamService } from "../services";


export const getTeamById = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide a team ID" });
  }

  try {
    const team = await teamService.getTeamById(userId, teamId);
    if (!team) {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or you don't have access to it" });
    }
    return sendResponse(res, { success: true, status: 200, data: team });
  } catch (error) {
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while loading the team. Please try again." });
  }
};

export const getAllTeams = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const teams = await teamService.getAllTeams(userId);
    return sendResponse(res, { success: true, status: 200, data: teams });
  } catch (error) {
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while loading your teams. Please try again." });
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const body = req.body;

  if (!body) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the team details" });
  }

  try {
    const isCreated = await teamService.createTeam(userId, body);
    if (isCreated) {
      return sendResponse(res, { success: true, status: 201, msg: "Team created successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "Team name and slug are required" });
    }
    if (error.message === "DUPLICATE_SLUG") {
      return sendResponse(res, { success: false, status: 409, msg: `A team with slug "${body?.slug}" already exists` });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while creating the team. Please try again." });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !body) {
    return sendResponse(res, { success: false, status: 400, msg: !body ? "Please provide the team details" : "Please provide a team ID" });
  }

  try {
    await teamService.updateTeam(userId, teamId, body);
    return sendResponse(res, { success: true, status: 200, msg: "Team updated successfully" });
  } catch (error: any) {
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "DUPLICATE_SLUG") {
      return sendResponse(res, { success: false, status: 409, msg: `A team with slug "${body?.slug}" already exists` });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while updating the team. Please try again." });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide a team ID" });
  }

  try {
    await teamService.deleteTeam(userId, teamId);
    return sendResponse(res, { success: true, status: 200, msg: "Team deleted successfully" });
  } catch (error: any) {
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or you don't have access to it" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while deleting the team. Please try again." });
  }
};


export const getTeamMembers = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide a team ID" });
  }

  try {
    const members = await teamService.getTeamMembers(userId, teamId);
    return sendResponse(res, { success: true, status: 200, data: members });
  } catch (error: any) {
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or you don't have access to it" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while loading team members. Please try again." });
  }
};

export const addTeamMember = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !body) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the team ID and member details" });
  }

  try {
    const isAdded = await teamService.addTeamMember(userId, teamId, body);
    if (isAdded) {
      return sendResponse(res, { success: true, status: 201, msg: "Member added successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "Please provide a user ID" });
    }
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "USER_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "This user was not found" });
    }
    if (error.message === "DUPLICATE_MEMBER") {
      return sendResponse(res, { success: false, status: 409, msg: "User is already a member of this team" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while adding the member. Please try again." });
  }
};

export const updateTeamMember = async (req: AuthRequest, res: Response) => {
  const { teamId, memberId } = req.params as { teamId: string; memberId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !memberId) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the team ID and member ID" });
  }

  try {
    await teamService.updateTeamMember(userId, teamId, memberId, body);
    return sendResponse(res, { success: true, status: 200, msg: "Member updated successfully" });
  } catch (error: any) {
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "MEMBER_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Member not found" });
    }
    if (error.message === "CANNOT_MODIFY_OWNER") {
      return sendResponse(res, { success: false, status: 403, msg: "The team owner cannot be modified" });
    }
    if (error.message === "CANNOT_TRANSFER_OWNERSHIP") {
      return sendResponse(res, { success: false, status: 403, msg: "Ownership cannot be transferred through this action" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while updating the member. Please try again." });
  }
};

export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  const { teamId, memberId } = req.params as { teamId: string; memberId: string };
  const userId = req.userId!;

  if (!teamId || !memberId) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the team ID and member ID" });
  }

  try {
    await teamService.removeTeamMember(userId, teamId, memberId);
    return sendResponse(res, { success: true, status: 200, msg: "Member removed successfully" });
  } catch (error: any) {
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "MEMBER_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Member not found" });
    }
    if (error.message === "CANNOT_REMOVE_OWNER") {
      return sendResponse(res, { success: false, status: 403, msg: "The team owner cannot be removed" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while removing the member. Please try again." });
  }
};


export const getTeamInvites = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide a team ID" });
  }

  try {
    const invites = await teamService.getTeamInvites(userId, teamId);
    return sendResponse(res, { success: true, status: 200, data: invites });
  } catch (error: any) {
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or you don't have access to it" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while loading invitations. Please try again." });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !body) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the team ID and invitation details" });
  }

  try {
    const isInvited = await teamService.inviteMember(userId, teamId, body);
    if (isInvited) {
      return sendResponse(res, { success: true, status: 201, msg: "Invitation sent successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "Please provide an email address" });
    }
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "ALREADY_MEMBER") {
      return sendResponse(res, { success: false, status: 409, msg: "This user is already a member of the team" });
    }
    if (error.message === "ALREADY_INVITED") {
      return sendResponse(res, { success: false, status: 409, msg: "An invitation has already been sent to this email address" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while sending the invitation. Please try again." });
  }
};

export const revokeInvite = async (req: AuthRequest, res: Response) => {
  const { teamId, inviteId } = req.params as { teamId: string; inviteId: string };
  const userId = req.userId!;

  if (!teamId || !inviteId) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the team ID and invitation ID" });
  }

  try {
    await teamService.revokeInvite(userId, teamId, inviteId);
    return sendResponse(res, { success: true, status: 200, msg: "Invitation revoked successfully" });
  } catch (error: any) {
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "INVITE_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Invitation not found" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while revoking the invitation. Please try again." });
  }
};

export const acceptInvite = async (req: AuthRequest, res: Response) => {
  const { token } = req.params as { token: string };
  const userId = req.userId!;

  if (!token) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide an invitation token" });
  }

  try {
    await teamService.acceptInvite(token, userId);
    return sendResponse(res, { success: true, status: 200, msg: "Invitation accepted successfully" });
  } catch (error: any) {
    if (error.message === "INVITE_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Invitation not found or is invalid" });
    }
    if (error.message === "INVITE_EXPIRED") {
      return sendResponse(res, { success: false, status: 410, msg: "This invitation has expired" });
    }
    if (error.message === "ALREADY_MEMBER") {
      return sendResponse(res, { success: false, status: 409, msg: "You are already a member of this team" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while accepting the invitation. Please try again." });
  }
};
