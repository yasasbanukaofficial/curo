import { Router } from "express";
import { authenticate, validate } from "../middlewares";
import {
  getAllTeams,
  getTeamById,
  checkEmails,
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
  acceptInviteFlow,
  acceptInvite,
  getInviteDetails,
  acceptInviteExplicit,
} from "../controller";
import {
  createTeamSchema,
  updateTeamSchema,
  addMemberSchema,
  updateMemberSchema,
  inviteMemberSchema,
} from "../validators";

const router = Router();

router.get("/all", authenticate, getAllTeams);
router.get("/get/:teamId", authenticate, getTeamById);
router.post("/check-emails", authenticate, checkEmails);
router.post("/create", authenticate, validate(createTeamSchema), createTeam);
router.put("/update/:teamId", authenticate, validate(updateTeamSchema), updateTeam);
router.delete("/delete/:teamId", authenticate, deleteTeam);

router.get("/get/:teamId/members", authenticate, getTeamMembers);
router.post("/get/:teamId/members", authenticate, validate(addMemberSchema), addTeamMember);
router.put("/get/:teamId/members/:memberId", authenticate, validate(updateMemberSchema), updateTeamMember);
router.delete("/get/:teamId/members/:memberId", authenticate, removeTeamMember);

router.get("/get/:teamId/invites", authenticate, getTeamInvites);
router.post("/get/:teamId/invites", authenticate, validate(inviteMemberSchema), inviteMember);
router.delete("/get/:teamId/invites/:inviteId", authenticate, revokeInvite);
router.get("/invite/accept/:token", acceptInviteFlow);
router.post("/invites/accept/:token", authenticate, acceptInvite);
router.get("/invite/:token", getInviteDetails);
router.post("/invite/accept", authenticate, acceptInviteExplicit);

export default router;
