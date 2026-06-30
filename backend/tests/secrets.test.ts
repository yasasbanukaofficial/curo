import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/secret.service", () => ({
  secretService: {
    getAllSecrets: vi.fn(),
    getSecretById: vi.fn(),
    saveSecretToDB: vi.fn(),
    updateSecretInDB: vi.fn(),
    deleteSecretInDB: vi.fn(),
  },
}));

import { secretService } from "../src/services/secret.service";

const app = createTestApp();

describe("Secrets API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/secrets/all", () => {
    it("returns all secrets", async () => {
      vi.mocked(secretService.getAllSecrets).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/secrets/all");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/v1/secrets/get/:secretId", () => {
    it("returns a secret by id", async () => {
      vi.mocked(secretService.getSecretById).mockResolvedValue({
        secName: "API_KEY",
        secKey: "encrypted",
        projectId: "proj_1",
        userId: {} as any,
      });

      const res = await request(app).get("/api/v1/secrets/get/sec_1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when secret not found", async () => {
      vi.mocked(secretService.getSecretById).mockResolvedValue(null);

      const res = await request(app).get("/api/v1/secrets/get/nonexistent");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/v1/secrets/save", () => {
    it("creates a secret with valid payload", async () => {
      vi.mocked(secretService.saveSecretToDB).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/secrets/save")
        .send({ secName: "API_KEY", secKey: "sk-123", projectId: "proj_1", environmentId: "env_1" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 for missing secName", async () => {
      vi.mocked(secretService.saveSecretToDB).mockRejectedValue(new Error("INVALID_PAYLOAD"));

      const res = await request(app)
        .post("/api/v1/secrets/save")
        .send({ secKey: "sk-123", projectId: "proj_1" });

      expect(res.status).toBe(400);
    });
  });

  describe("PUT /api/v1/secrets/update/:secretId", () => {
    it("updates a secret", async () => {
      vi.mocked(secretService.updateSecretInDB).mockResolvedValue(true);

      const res = await request(app)
        .put("/api/v1/secrets/update/sec_1")
        .send({ secKey: "new-value" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when secret not found", async () => {
      vi.mocked(secretService.updateSecretInDB).mockRejectedValue(new Error("SECRET_NOT_FOUND"));

      const res = await request(app)
        .put("/api/v1/secrets/update/nonexistent")
        .send({ secKey: "new-value" });

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/secrets/delete/:secretId", () => {
    it("deletes a secret", async () => {
      vi.mocked(secretService.deleteSecretInDB).mockResolvedValue(true);

      const res = await request(app).delete("/api/v1/secrets/delete/sec_1");

      expect(res.status).toBe(200);
    });

    it("returns 404 when secret not found", async () => {
      vi.mocked(secretService.deleteSecretInDB).mockRejectedValue(new Error("SECRET_NOT_FOUND"));

      const res = await request(app).delete("/api/v1/secrets/delete/nonexistent");

      expect(res.status).toBe(404);
    });
  });
});
