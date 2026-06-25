import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { teamService } from "../services";


export const getTeamById = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID is required" });
  }

  try {
    const team = await teamService.getTeamById(userId, teamId);
    if (!team) {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found" });
    }
    return sendResponse(res, { success: true, status: 200, data: team });
  } catch (error) {
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error while fetching team" });
  }
};

export const getAllTeams = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const teams = await teamService.getAllTeams(userId);
    return sendResponse(res, { success: true, status: 200, data: teams });
  } catch (error) {
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error while fetching teams" });
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const body = req.body;

  if (!body) {
    return sendResponse(res, { success: false, status: 400, msg: "Request body is required" });
  }

  try {
    const isCreated = await teamService.createTeam(userId, body);
    if (isCreated) {
      return sendResponse(res, { success: true, status: 201, msg: "Team created successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "name and slug are required" });
    }
    if (error.message === "DUPLICATE_SLUG") {
      return sendResponse(res, { success: false, status: 409, msg: `A team with slug "${body?.slug}" already exists` });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error while creating team" });
  }
};

export const updateTeam = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !body) {
    return sendResponse(res, { success: false, status: 400, msg: !body ? "Request body is required" : "Team ID is required" });
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
    return sendResponse(res, { success: false, status: 500, msg: error.message });
  }
};

export const deleteTeam = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID is required" });
  }

  try {
    await teamService.deleteTeam(userId, teamId);
    return sendResponse(res, { success: true, status: 200, msg: "Team deleted successfully" });
  } catch (error: any) {
    const status = error.message === "TEAM_NOT_FOUND" ? 404 : 500;
    return sendResponse(res, { success: false, status, msg: error.message });
  }
};


export const getTeamMembers = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID is required" });
  }

  try {
    const members = await teamService.getTeamMembers(userId, teamId);
    return sendResponse(res, { success: true, status: 200, data: members });
  } catch (error: any) {
    const status = error.message === "TEAM_NOT_FOUND" ? 404 : 500;
    return sendResponse(res, { success: false, status, msg: error.message });
  }
};

export const addTeamMember = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !body) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID and request body are required" });
  }

  try {
    const isAdded = await teamService.addTeamMember(userId, teamId, body);
    if (isAdded) {
      return sendResponse(res, { success: true, status: 201, msg: "Member added successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "userId is required" });
    }
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "USER_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "User not found" });
    }
    if (error.message === "DUPLICATE_MEMBER") {
      return sendResponse(res, { success: false, status: 409, msg: "User is already a member of this team" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error while adding member" });
  }
};

export const updateTeamMember = async (req: AuthRequest, res: Response) => {
  const { teamId, memberId } = req.params as { teamId: string; memberId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !memberId) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID and Member ID are required" });
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
      return sendResponse(res, { success: false, status: 403, msg: "Cannot modify the team owner" });
    }
    if (error.message === "CANNOT_TRANSFER_OWNERSHIP") {
      return sendResponse(res, { success: false, status: 403, msg: "Cannot transfer ownership through this endpoint" });
    }
    return sendResponse(res, { success: false, status: 500, msg: error.message });
  }
};

export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  const { teamId, memberId } = req.params as { teamId: string; memberId: string };
  const userId = req.userId!;

  if (!teamId || !memberId) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID and Member ID are required" });
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
      return sendResponse(res, { success: false, status: 403, msg: "Cannot remove the team owner" });
    }
    return sendResponse(res, { success: false, status: 500, msg: error.message });
  }
};


export const getTeamInvites = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;

  if (!teamId) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID is required" });
  }

  try {
    const invites = await teamService.getTeamInvites(userId, teamId);
    return sendResponse(res, { success: true, status: 200, data: invites });
  } catch (error: any) {
    const status = error.message === "TEAM_NOT_FOUND" ? 404 : 500;
    return sendResponse(res, { success: false, status, msg: error.message });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params as { teamId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!teamId || !body) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID and request body are required" });
  }

  try {
    const isInvited = await teamService.inviteMember(userId, teamId, body);
    if (isInvited) {
      return sendResponse(res, { success: true, status: 201, msg: "Invitation sent successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "email is required" });
    }
    if (error.message === "TEAM_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Team not found or insufficient permissions" });
    }
    if (error.message === "ALREADY_MEMBER") {
      return sendResponse(res, { success: false, status: 409, msg: "User is already a member of this team" });
    }
    if (error.message === "ALREADY_INVITED") {
      return sendResponse(res, { success: false, status: 409, msg: "An invitation has already been sent to this email" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error while sending invitation" });
  }
};

export const revokeInvite = async (req: AuthRequest, res: Response) => {
  const { teamId, inviteId } = req.params as { teamId: string; inviteId: string };
  const userId = req.userId!;

  if (!teamId || !inviteId) {
    return sendResponse(res, { success: false, status: 400, msg: "Team ID and Invite ID are required" });
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
    return sendResponse(res, { success: false, status: 500, msg: error.message });
  }
};

export const acceptInvite = async (req: AuthRequest, res: Response) => {
  const { token } = req.params as { token: string };
  const userId = req.userId!;

  if (!token) {
    return sendResponse(res, { success: false, status: 400, msg: "Invite token is required" });
  }

  try {
    await teamService.acceptInvite(token, userId);
    return sendResponse(res, { success: true, status: 200, msg: "Invitation accepted successfully" });
  } catch (error: any) {
    if (error.message === "INVITE_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Invitation not found or invalid" });
    }
    if (error.message === "INVITE_EXPIRED") {
      return sendResponse(res, { success: false, status: 410, msg: "Invitation has expired" });
    }
    if (error.message === "ALREADY_MEMBER") {
      return sendResponse(res, { success: false, status: 409, msg: "You are already a member of this team" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Internal server error while accepting invitation" });
  }
};
