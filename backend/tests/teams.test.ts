import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/team.service", () => ({
  teamService: {
    getAllTeams: vi.fn(),
    getTeamById: vi.fn(),
    createTeam: vi.fn(),
    updateTeam: vi.fn(),
    deleteTeam: vi.fn(),
    getTeamMembers: vi.fn(),
    addTeamMember: vi.fn(),
    updateTeamMember: vi.fn(),
    removeTeamMember: vi.fn(),
    getTeamInvites: vi.fn(),
    inviteMember: vi.fn(),
    revokeInvite: vi.fn(),
    acceptInvite: vi.fn(),
  },
}));

import { teamService } from "../src/services/team.service";

const app = createTestApp();

describe("Teams API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/teams/all", () => {
    it("returns all teams", async () => {
      vi.mocked(teamService.getAllTeams).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/teams/all");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/teams/get/:teamId", () => {
    it("returns a team by id", async () => {
      vi.mocked(teamService.getTeamById).mockResolvedValue({ name: "Acme", slug: "acme", ownerId: {} as any, plan: "starter", subscriptionStatus: "active", enforce2fa: false, allowedDomains: [] });

      const res = await request(app).get("/api/v1/teams/get/team_1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when team not found", async () => {
      vi.mocked(teamService.getTeamById).mockResolvedValue(null);

      const res = await request(app).get("/api/v1/teams/get/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/v1/teams/create", () => {
    it("creates a team with valid payload", async () => {
      vi.mocked(teamService.createTeam).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/teams/create")
        .send({ name: "New Team", slug: "new-team" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 for missing name", async () => {
      const res = await request(app)
        .post("/api/v1/teams/create")
        .send({ slug: "new-team" });

      expect(res.status).toBe(400);
    });

    it("returns 400 for missing slug", async () => {
      const res = await request(app)
        .post("/api/v1/teams/create")
        .send({ name: "New Team" });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v1/teams/update/:teamId", () => {
    it("updates a team with valid payload", async () => {
      vi.mocked(teamService.updateTeam).mockResolvedValue(true);

      const res = await request(app)
        .put("/api/v1/teams/update/team_1")
        .send({ name: "Updated Team" });

      expect(res.status).toBe(200);
    });

    it("returns 200 when empty payload (updateTeamSchema makes all fields optional)", async () => {
      vi.mocked(teamService.updateTeam).mockResolvedValue(true);

      const res = await request(app)
        .put("/api/v1/teams/update/team_1")
        .send({});

      expect(res.status).toBe(200);
    });

    it("returns 404 when team not found", async () => {
      vi.mocked(teamService.updateTeam).mockRejectedValue(new Error("TEAM_NOT_FOUND"));

      const res = await request(app)
        .put("/api/v1/teams/update/nonexistent")
        .send({ name: "Updated" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/teams/delete/:teamId", () => {
    it("deletes a team", async () => {
      vi.mocked(teamService.deleteTeam).mockResolvedValue(true);

      const res = await request(app).delete("/api/v1/teams/delete/team_1");

      expect(res.status).toBe(200);
    });

    it("returns 404 when team not found", async () => {
      vi.mocked(teamService.deleteTeam).mockRejectedValue(new Error("TEAM_NOT_FOUND"));

      const res = await request(app).delete("/api/v1/teams/delete/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/v1/teams/get/:teamId/members", () => {
    it("returns team members", async () => {
      vi.mocked(teamService.getTeamMembers).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/teams/get/team_1/members");

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/v1/teams/get/:teamId/members", () => {
    it("adds a team member", async () => {
      vi.mocked(teamService.addTeamMember).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/teams/get/team_1/members")
        .send({ userId: "user_2", role: "developer" });

      expect(res.status).toBe(201);
    });

    it("returns 400 for missing userId", async () => {
      const res = await request(app)
        .post("/api/v1/teams/get/team_1/members")
        .send({ role: "developer" });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v1/teams/get/:teamId/members/:memberId", () => {
    it("updates a team member", async () => {
      vi.mocked(teamService.updateTeamMember).mockResolvedValue(true);

      const res = await request(app)
        .put("/api/v1/teams/get/team_1/members/mem_1")
        .send({ role: "admin" });

      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /api/v1/teams/get/:teamId/members/:memberId", () => {
    it("removes a team member", async () => {
      vi.mocked(teamService.removeTeamMember).mockResolvedValue(true);

      const res = await request(app).delete("/api/v1/teams/get/team_1/members/mem_1");

      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/v1/teams/get/:teamId/invites", () => {
    it("returns team invites", async () => {
      vi.mocked(teamService.getTeamInvites).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/teams/get/team_1/invites");

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/v1/teams/get/:teamId/invites", () => {
    it("invites a member", async () => {
      vi.mocked(teamService.inviteMember).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/teams/get/team_1/invites")
        .send({ email: "test@test.com", role: "developer" });

      expect(res.status).toBe(201);
    });

    it("returns 400 for invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/teams/get/team_1/invites")
        .send({ email: "not-an-email" });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/v1/teams/get/:teamId/invites/:inviteId", () => {
    it("revokes an invite", async () => {
      vi.mocked(teamService.revokeInvite).mockResolvedValue(true);

      const res = await request(app).delete("/api/v1/teams/get/team_1/invites/inv_1");

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/v1/teams/invites/accept/:token", () => {
    it("accepts an invite", async () => {
      vi.mocked(teamService.acceptInvite).mockResolvedValue(true);

      const res = await request(app).post("/api/v1/teams/invites/accept/mock-token");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 410 for expired token", async () => {
      vi.mocked(teamService.acceptInvite).mockRejectedValue(new Error("INVITE_EXPIRED"));

      const res = await request(app).post("/api/v1/teams/invites/accept/expired-token");

      expect(res.status).toBe(410);
    });
  });
});
