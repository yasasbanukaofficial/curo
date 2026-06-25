import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/version.service", () => ({
  versionService: {
    getAllVersions: vi.fn(),
    createVersion: vi.fn(),
  },
}));

import { versionService } from "../src/services/version.service";

const app = createTestApp();

describe("Versions API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/versions/all/:secretId", () => {
    it("returns all versions for a secret", async () => {
      vi.mocked(versionService.getAllVersions).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/versions/all/sec_1");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/v1/versions/save", () => {
    it("creates a version", async () => {
      vi.mocked(versionService.createVersion).mockResolvedValue(true);

      const res = await request(app)
        .post("/api/v1/versions/save")
        .send({ secretId: "sec_1", secKey: "encrypted-value" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 for missing payload", async () => {
      vi.mocked(versionService.createVersion).mockRejectedValue(new Error("INVALID_PAYLOAD"));

      const res = await request(app)
        .post("/api/v1/versions/save")
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
