import { TeamModel, TeamMemberModel, TeamInviteModel } from "../models";
import { ITeam } from "../types/team";
import { ITeamMember, TeamRole } from "../types/teamMember";
import { ITeamInvite } from "../types/teamInvite";
import { UserModel } from "../models/user.model";
import crypto from "crypto";
import { sendTeamInviteEmail } from "../util/email";

export const teamService = {

 
  checkEmails: async (emailList: string[]): Promise<{ registered: string[]; unregistered: string[] }> => {
    try {
      const registered: string[] = [];
      const unregistered: string[] = [];

      for (const email of emailList) {
        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (user) {
          registered.push(email);
        } else {
          unregistered.push(email);
        }
      }

      return { registered, unregistered };
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  getTeamById: async (userId: string, teamId: string): Promise<ITeam | null> => {
    try {
      const membership = await TeamMemberModel.findOne({ teamId, userId, status: "active" });
      if (!membership) return null;

      const teamDoc = await TeamModel.findById(teamId);
      return teamDoc ? teamDoc.toObject() : null;
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  getAllTeams: async (userId: string): Promise<ITeam[]> => {
    try {
      const memberships = await TeamMemberModel.find({ userId, status: "active" });
      const teamIds = memberships.map((m) => m.teamId);

      const teams = await TeamModel.find({ _id: { $in: teamIds } }).sort({ createdAt: -1 });
      return teams.map((t) => t.toObject());
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  createTeam: async (
    userId: string,
    data: Partial<ITeam> & { emails?: { email: string; role?: string }[] }
  ): Promise<boolean> => {
    const { name, slug, emails } = data;
    if (!name || !slug) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const team = await TeamModel.create({ ...data, ownerId: userId });

      await TeamMemberModel.create({
        teamId: team._id,
        userId,
        role: "owner",
        status: "active",
        joinedAt: new Date(),
      });

      if (emails && emails.length > 0) {
        const inviter = await UserModel.findById(userId).select("name");
        const inviterName = inviter?.name || "Someone";

        for (const entry of emails) {
          const existingUser = await UserModel.findOne({ email: entry.email });

          if (existingUser) {
            const existingMember = await TeamMemberModel.findOne({
              teamId: team._id,
              userId: existingUser._id,
            });
            if (!existingMember) {
              await TeamMemberModel.create({
                teamId: team._id,
                userId: existingUser._id,
                role: (entry.role as TeamRole) || "developer",
                status: "invited",
              });
            }
          } else {
            const token = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            await TeamInviteModel.create({
              teamId: team._id,
              email: entry.email,
              role: (entry.role as TeamRole) || "developer",
              token,
              expiresAt,
              invitedToSignup: true,
            });

            sendTeamInviteEmail(entry.email, name, inviterName, token, expiresAt);
          }
        }
      }

      return true;
    } catch (dbError: any) {
      if (dbError.code === 11000) {
        throw new Error("DUPLICATE_SLUG");
      }
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },

  updateTeam: async (userId: string, teamId: string, data: Partial<ITeam>): Promise<boolean> => {
    if (!teamId) {
      throw new Error("TEAM_ID_NOT_EXISTING");
    }

    try {
      const membership = await TeamMemberModel.findOne({
        teamId,
        userId,
        role: { $in: ["owner", "admin"] },
        status: "active",
      });
      if (!membership) {
        throw new Error("TEAM_NOT_FOUND");
      }

      const updated = await TeamModel.findByIdAndUpdate(teamId, { $set: data }, { returnDocument: "after" });
      if (!updated) {
        throw new Error("TEAM_NOT_FOUND");
      }

      return true;
    } catch (error: any) {
      if (error.message === "TEAM_NOT_FOUND") throw error;
      if (error.code === 11000) {
        throw new Error("DUPLICATE_SLUG");
      }
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  deleteTeam: async (userId: string, teamId: string): Promise<boolean> => {
    try {
      const membership = await TeamMemberModel.findOne({
        teamId,
        userId,
        role: "owner",
        status: "active",
      });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      await TeamInviteModel.deleteMany({ teamId });
      await TeamMemberModel.deleteMany({ teamId });
      const deleted = await TeamModel.findByIdAndDelete(teamId);
      if (!deleted) throw new Error("TEAM_NOT_FOUND");

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },


 
  getTeamMembers: async (userId: string, teamId: string): Promise<any[]> => {
    try {
      const membership = await TeamMemberModel.findOne({ teamId, userId, status: "active" });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      const members = await TeamMemberModel.find({ teamId })
        .populate("userId", "name email avatarUrl")
        .sort({ joinedAt: -1 });

      return members.map((m) => {
        const obj = m.toObject();
        const user = obj.userId as any;
        return {
          _id: obj._id,
          teamId: obj.teamId,
          userId: user?._id || obj.userId,
          name: user?.name || "Unknown",
          email: user?.email || "",
          avatarUrl: user?.avatarUrl,
          role: obj.role,
          status: obj.status,
          joinedAt: obj.joinedAt,
          createdAt: obj.createdAt,
        };
      });
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  addTeamMember: async (
    userId: string,
    teamId: string,
    data: { userId: string; role?: string },
  ): Promise<boolean> => {
    const { userId: targetUserId, role } = data;
    if (!teamId || !targetUserId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const membership = await TeamMemberModel.findOne({
        teamId,
        userId,
        role: { $in: ["owner", "admin"] },
        status: "active",
      });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      const targetUser = await UserModel.findById(targetUserId);
      if (!targetUser) throw new Error("USER_NOT_FOUND");

      await TeamMemberModel.create({
        teamId,
        userId: targetUserId,
        role: (role as TeamRole) || "developer",
        status: "invited",
      });

      return true;
    } catch (error: any) {
      if (["TEAM_NOT_FOUND", "USER_NOT_FOUND"].includes(error.message)) throw error;
      if (error.code === 11000) {
        throw new Error("DUPLICATE_MEMBER");
      }
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  updateTeamMember: async (
    userId: string,
    teamId: string,
    memberId: string,
    data: Partial<ITeamMember>,
  ): Promise<boolean> => {
    if (!teamId || !memberId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const membership = await TeamMemberModel.findOne({
        teamId,
        userId,
        role: { $in: ["owner", "admin"] },
        status: "active",
      });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      const target = await TeamMemberModel.findOne({ _id: memberId, teamId });
      if (!target) throw new Error("MEMBER_NOT_FOUND");

      if (target.role === "owner") throw new Error("CANNOT_MODIFY_OWNER");

      if (data.role === "owner") throw new Error("CANNOT_TRANSFER_OWNERSHIP");

      const updated = await TeamMemberModel.findByIdAndUpdate(memberId, { $set: data }, { returnDocument: "after" });
      if (!updated) throw new Error("MEMBER_NOT_FOUND");

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  removeTeamMember: async (
    userId: string,
    teamId: string,
    memberId: string,
  ): Promise<boolean> => {
    if (!teamId || !memberId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const membership = await TeamMemberModel.findOne({
        teamId,
        userId,
        role: { $in: ["owner", "admin"] },
        status: "active",
      });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      const target = await TeamMemberModel.findOne({ _id: memberId, teamId });
      if (!target) throw new Error("MEMBER_NOT_FOUND");
      if (target.role === "owner") throw new Error("CANNOT_REMOVE_OWNER");

      const user = await UserModel.findById(target.userId).select("email");
      if (user) {
        await TeamInviteModel.deleteMany({ teamId, email: user.email });
      }

      await TeamMemberModel.findByIdAndDelete(memberId);

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },


 
  getTeamInvites: async (userId: string, teamId: string): Promise<ITeamInvite[]> => {
    try {
      const membership = await TeamMemberModel.findOne({ teamId, userId, status: "active" });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      const invites = await TeamInviteModel.find({ teamId }).sort({ createdAt: -1 });
      return invites.map((i) => i.toObject());
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  inviteMember: async (
    userId: string,
    teamId: string,
    data: { email: string; role?: string },
  ): Promise<boolean> => {
    const { email, role } = data;
    if (!teamId || !email) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const membership = await TeamMemberModel.findOne({
        teamId,
        userId,
        role: { $in: ["owner", "admin"] },
        status: "active",
      });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      const invitedUser = await UserModel.findOne({ email });
      if (invitedUser) {
        const existingMember = await TeamMemberModel.findOne({ teamId, userId: invitedUser._id });
        if (existingMember) throw new Error("ALREADY_MEMBER");
      }

      const existingInvite = await TeamInviteModel.findOne({ teamId, email });
      if (existingInvite) throw new Error("ALREADY_INVITED");

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await TeamInviteModel.create({
        teamId,
        email,
        role: (role as TeamRole) || "developer",
        token,
        expiresAt,
      });

      const team = await TeamModel.findById(teamId);
      const inviter = await UserModel.findById(userId).select("name");
      const inviterName = inviter?.name || "Someone";
      if (team) {
        sendTeamInviteEmail(email, team.name, inviterName, token, expiresAt);
      }

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  revokeInvite: async (
    userId: string,
    teamId: string,
    inviteId: string,
  ): Promise<boolean> => {
    if (!teamId || !inviteId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const membership = await TeamMemberModel.findOne({
        teamId,
        userId,
        role: { $in: ["owner", "admin"] },
        status: "active",
      });
      if (!membership) throw new Error("TEAM_NOT_FOUND");

      const deleted = await TeamInviteModel.findOneAndDelete({ _id: inviteId, teamId });
      if (!deleted) throw new Error("INVITE_NOT_FOUND");

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  getInviteDetailsByToken: async (token: string): Promise<{ teamName: string; teamAvatar?: string; memberCount: number; role: string; hasAccount: boolean }> => {
    const invite = await TeamInviteModel.findOne({ token });
    if (!invite) throw new Error("INVITE_NOT_FOUND");
    if (invite.expiresAt < new Date()) throw new Error("INVITE_EXPIRED");

    const team = await TeamModel.findById(invite.teamId);
    if (!team) throw new Error("TEAM_NOT_FOUND");

    const memberCount = await TeamMemberModel.countDocuments({ teamId: invite.teamId });
    const user = await UserModel.findOne({ email: invite.email });

    return {
      teamName: team.name,
      teamAvatar: team.avatarUrl,
      memberCount,
      role: invite.role,
      hasAccount: !!user,
    };
  },

  acceptInviteFlow: async (token: string): Promise<{ redirect: string }> => {
    try {
      const invite = await TeamInviteModel.findOne({ token });
      if (!invite) throw new Error("INVITE_NOT_FOUND");
      if (invite.expiresAt < new Date()) throw new Error("INVITE_EXPIRED");

      const user = await UserModel.findOne({ email: invite.email });

      if (user) {
        const existingMembership = await TeamMemberModel.findOne({
          teamId: invite.teamId,
          userId: user._id,
        });
        if (existingMembership) {
          if (existingMembership.status === "invited") {
            await TeamMemberModel.findByIdAndUpdate(existingMembership._id, { status: "active", joinedAt: new Date() });
          }
        } else {
          await TeamMemberModel.create({
            teamId: invite.teamId,
            userId: user._id,
            role: invite.role,
            status: "active",
            joinedAt: new Date(),
          });
        }
        return { redirect: "/dashboard" };
      }

      return { redirect: `/register?invite=${token}` };
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  acceptInvite: async (token: string, userId: string): Promise<boolean> => {
    try {
      const invite = await TeamInviteModel.findOne({ token });
      if (!invite) throw new Error("INVITE_NOT_FOUND");
      if (invite.expiresAt < new Date()) throw new Error("INVITE_EXPIRED");

      const existingMembership = await TeamMemberModel.findOne({
        teamId: invite.teamId,
        userId,
      });
      if (existingMembership) {
        if (existingMembership.status === "invited") {
          await TeamMemberModel.findByIdAndUpdate(existingMembership._id, { status: "active", joinedAt: new Date() });
        }
        return true;
      }

      await TeamMemberModel.create({
        teamId: invite.teamId,
        userId,
        role: invite.role,
        status: "active",
        joinedAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
};
