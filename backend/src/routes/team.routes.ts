import { Router } from "express";
import { authenticate, validate } from "../middlewares";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  getTeamInvites,
  inviteMember,
  revokeInvite,
  acceptInvite,
} from "../controller";
import {
  createTeamSchema,
  updateTeamSchema,
  addMemberSchema,
  updateMemberSchema,
  inviteMemberSchema,
} from "../validators";

const router = Router();

// Teams
router.get("/all", authenticate, getAllTeams);
router.get("/get/:teamId", authenticate, getTeamById);
router.post("/create", authenticate, validate(createTeamSchema), createTeam);
router.put("/update/:teamId", authenticate, validate(updateTeamSchema), updateTeam);
router.delete("/delete/:teamId", authenticate, deleteTeam);

// Members
router.get("/get/:teamId/members", authenticate, getTeamMembers);
router.post("/get/:teamId/members", authenticate, validate(addMemberSchema), addTeamMember);
router.put("/get/:teamId/members/:memberId", authenticate, validate(updateMemberSchema), updateTeamMember);
router.delete("/get/:teamId/members/:memberId", authenticate, removeTeamMember);

// Invites
router.get("/get/:teamId/invites", authenticate, getTeamInvites);
router.post("/get/:teamId/invites", authenticate, validate(inviteMemberSchema), inviteMember);
router.delete("/get/:teamId/invites/:inviteId", authenticate, revokeInvite);
router.post("/invites/accept/:token", authenticate, acceptInvite);

export default router;
