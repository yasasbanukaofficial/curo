import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/audit.service", () => ({
  auditService: {
    getAllAudits: vi.fn(),
  },
}));

import { auditService } from "../src/services/audit.service";

const app = createTestApp();

describe("Audits API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/v1/audits/all", () => {
    it("returns all audits", async () => {
      vi.mocked(auditService.getAllAudits).mockResolvedValue([]);

      const res = await request(app).get("/api/v1/audits/all");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
