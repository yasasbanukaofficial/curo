import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/user.service", () => ({
  userService: {
    getOverviewStats: vi.fn(),
  },
}));

import { userService } from "../src/services/user.service";

const app = createTestApp();

describe("Users API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/users/overview/stats", () => {
    it("returns overview stats", async () => {
      vi.mocked(userService.getOverviewStats).mockResolvedValue({
        teams: 2,
        projects: 5,
        secrets: 20,
        environments: 10,
        recentProjects: [],
        recentSecrets: [],
      });

      const res = await request(app).get("/api/v1/users/overview/stats");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.teams).toBe(2);
      expect(res.body.data.projects).toBe(5);
    });

    it("returns zero counts when user has no data", async () => {
      vi.mocked(userService.getOverviewStats).mockResolvedValue({
        teams: 0,
        projects: 0,
        secrets: 0,
        environments: 0,
        recentProjects: [],
        recentSecrets: [],
      });

      const res = await request(app).get("/api/v1/users/overview/stats");

      expect(res.status).toBe(200);
      expect(res.body.data.teams).toBe(0);
      expect(res.body.data.projects).toBe(0);
      expect(res.body.data.secrets).toBe(0);
    });

    it("returns recent projects and secrets", async () => {
      vi.mocked(userService.getOverviewStats).mockResolvedValue({
        teams: 1,
        projects: 3,
        secrets: 5,
        environments: 2,
        recentProjects: [
          { _id: "p1", projectName: "My App", secretCount: 3, environmentCount: 2 },
          { _id: "p2", projectName: "API", secretCount: 2, environmentCount: 0 },
        ],
        recentSecrets: [
          { _id: "s1", secName: "DB_URL", projectId: "p1", projectName: "My App" },
        ],
      });

      const res = await request(app).get("/api/v1/users/overview/stats");

      expect(res.status).toBe(200);
      expect(res.body.data.recentProjects).toHaveLength(2);
      expect(res.body.data.recentSecrets).toHaveLength(1);
      expect(res.body.data.recentProjects[0].projectName).toBe("My App");
    });
  });
});
