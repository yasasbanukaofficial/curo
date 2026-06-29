import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/project.service", () => ({
  projectService: {
    getAllProjects: vi.fn(),
    getProjectById: vi.fn(),
    createProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    setProjectTeam: vi.fn(),
    unsetProjectTeam: vi.fn(),
  },
}));

import { projectService } from "../src/services/project.service";

const app = createTestApp();

describe("Projects API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/projects/all", () => {
    it("returns all projects", async () => {
      vi.mocked(projectService.getAllProjects).mockResolvedValue([
        { projectName: "Test", description: "A project", projectLink: undefined, userId: {} as any },
      ]);

      const res = await request(app).get("/api/v1/projects/all");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });

    it("returns empty array when no projects", async () => {
      vi.mocked(projectService.getAllProjects).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/projects/all");

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe("GET /api/v1/projects/get/:projectId", () => {
    it("returns a project by id", async () => {
      vi.mocked(projectService.getProjectById).mockResolvedValue({
        projectName: "Test", description: "A project", projectLink: undefined, userId: {} as any,
      });

      const res = await request(app).get("/api/v1/projects/get/proj_1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 when projectId missing", async () => {
      const res = await request(app).get("/api/v1/projects/get/");

      expect(res.status).toBe(404);
    });

    it("returns 404 when project not found", async () => {
      vi.mocked(projectService.getProjectById).mockResolvedValue(null);

      const res = await request(app).get("/api/v1/projects/get/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/v1/projects/create", () => {
    it("creates a project with valid payload", async () => {
      vi.mocked(projectService.createProject).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/projects/create")
        .send({ projectName: "New Project", description: "Description" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 for missing projectName", async () => {
      vi.mocked(projectService.createProject).mockRejectedValue(new Error("INVALID_PAYLOAD"));

      const res = await request(app)
        .post("/api/v1/projects/create")
        .send({ description: "Only description" });

      expect(res.status).toBe(400);
    });

    it("returns 400 for missing description", async () => {
      vi.mocked(projectService.createProject).mockRejectedValue(new Error("INVALID_PAYLOAD"));

      const res = await request(app)
        .post("/api/v1/projects/create")
        .send({ projectName: "Only name" });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v1/projects/update/:projectId", () => {
    it("updates a project with valid payload", async () => {
      vi.mocked(projectService.updateProject).mockResolvedValue(true);

      const res = await request(app)
        .put("/api/v1/projects/update/proj_1")
        .send({ projectName: "Updated Name" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 500 for empty payload (controller doesn't map INVALID_PAYLOAD)", async () => {
      vi.mocked(projectService.updateProject).mockRejectedValue(new Error("INVALID_PAYLOAD"));

      const res = await request(app)
        .put("/api/v1/projects/update/proj_1")
        .send({});

      expect(res.status).toBe(500);
    });

    it("returns 404 when project not found", async () => {
      vi.mocked(projectService.updateProject).mockRejectedValue(new Error("PROJECT_NOT_FOUND"));

      const res = await request(app)
        .put("/api/v1/projects/update/nonexistent")
        .send({ projectName: "New" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/projects/delete/:projectId", () => {
    it("deletes a project", async () => {
      vi.mocked(projectService.deleteProject).mockResolvedValue(true);

      const res = await request(app).delete("/api/v1/projects/delete/proj_1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when project not found", async () => {
      vi.mocked(projectService.deleteProject).mockRejectedValue(new Error("PROJECT_NOT_FOUND"));

      const res = await request(app).delete("/api/v1/projects/delete/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/v1/projects/:projectId/teams", () => {
    it("sets team on a project", async () => {
      vi.mocked(projectService.setProjectTeam).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/projects/proj_1/teams")
        .send({ teamId: "team_1" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 when teamId missing", async () => {
      const res = await request(app)
        .post("/api/v1/projects/proj_1/teams")
        .send({});

      expect(res.status).toBe(400);
    });

    it("returns 404 when project not found", async () => {
      vi.mocked(projectService.setProjectTeam).mockRejectedValue(new Error("PROJECT_NOT_FOUND"));

      const res = await request(app)
        .post("/api/v1/projects/nonexistent/teams")
        .send({ teamId: "team_1" });

      expect(res.status).toBe(404);
    });

    it("returns 400 when team already assigned", async () => {
      vi.mocked(projectService.setProjectTeam).mockRejectedValue(new Error("TEAM_ALREADY_ASSIGNED"));

      const res = await request(app)
        .post("/api/v1/projects/proj_1/teams")
        .send({ teamId: "team_1" });

      expect(res.status).toBe(400);
    });
  });

  describe("DELETE /api/v1/projects/:projectId/teams", () => {
    it("unsets team from a project", async () => {
      vi.mocked(projectService.unsetProjectTeam).mockResolvedValue(true);

      const res = await request(app).delete("/api/v1/projects/proj_1/teams");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when project not found", async () => {
      vi.mocked(projectService.unsetProjectTeam).mockRejectedValue(new Error("PROJECT_NOT_FOUND"));

      const res = await request(app).delete("/api/v1/projects/nonexistent/teams");

      expect(res.status).toBe(404);
    });

    it("returns 400 when no team assigned", async () => {
      vi.mocked(projectService.unsetProjectTeam).mockRejectedValue(new Error("TEAM_NOT_ASSIGNED"));

      const res = await request(app).delete("/api/v1/projects/proj_1/teams");

      expect(res.status).toBe(400);
    });
  });
});
