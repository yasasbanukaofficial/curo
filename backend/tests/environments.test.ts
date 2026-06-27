import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/environment.service", () => ({
  environmentService: {
    getAllEnvironments: vi.fn(),
    getEnvironmentById: vi.fn(),
    createEnvironment: vi.fn(),
    updateEnvironment: vi.fn(),
    deleteEnvironment: vi.fn(),
  },
}));

import { environmentService } from "../src/services/environment.service";

const app = createTestApp();

describe("Environments API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/environments/all", () => {
    it("returns all environments", async () => {
      vi.mocked(environmentService.getAllEnvironments).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/environments/all");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/environments/get/:environmentId", () => {
    it("returns an environment by id", async () => {
      vi.mocked(environmentService.getEnvironmentById).mockResolvedValue({
        name: "Production",
        userId: {} as any,
      });

      const res = await request(app).get("/api/v1/environments/get/env_1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when not found", async () => {
      vi.mocked(environmentService.getEnvironmentById).mockResolvedValue(null);

      const res = await request(app).get("/api/v1/environments/get/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/v1/environments/create", () => {
    it("creates an environment", async () => {
      vi.mocked(environmentService.createEnvironment).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/environments/create")
        .send({ name: "Staging" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 for missing name", async () => {
      vi.mocked(environmentService.createEnvironment).mockRejectedValue(new Error("INVALID_PAYLOAD"));

      const res = await request(app)
        .post("/api/v1/environments/create")
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v1/environments/update/:environmentId", () => {
    it("updates an environment", async () => {
      vi.mocked(environmentService.updateEnvironment).mockResolvedValue(true);

      const res = await request(app)
        .put("/api/v1/environments/update/env_1")
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
    });

    it("returns 404 when not found", async () => {
      vi.mocked(environmentService.updateEnvironment).mockRejectedValue(new Error("ENVIRONMENT_NOT_FOUND"));

      const res = await request(app)
        .put("/api/v1/environments/update/nonexistent")
        .send({ name: "Updated" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/environments/delete/:environmentId", () => {
    it("deletes an environment", async () => {
      vi.mocked(environmentService.deleteEnvironment).mockResolvedValue(true);

      const res = await request(app).delete("/api/v1/environments/delete/env_1");

      expect(res.status).toBe(200);
    });

    it("returns 404 when not found", async () => {
      vi.mocked(environmentService.deleteEnvironment).mockRejectedValue(new Error("ENVIRONMENT_NOT_FOUND"));

      const res = await request(app).delete("/api/v1/environments/delete/nonexistent");

      expect(res.status).toBe(404);
    });
  });
});
