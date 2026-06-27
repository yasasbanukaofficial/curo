import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/auth.service", () => ({
  authService: {
    createUser: vi.fn(),
    authenticateUser: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
  },
}));

import { authService } from "../src/services/auth.service";

const app = createTestApp();

describe("Auth API", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/v1/auth/register", () => {
    it("registers a user with valid payload", async () => {
      vi.mocked(authService.createUser).mockResolvedValue({ success: true, status: 201, data: { id: "user_1", name: "Test", email: "test@test.com" } });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test User", email: "test@test.com", password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 for missing name", async () => {
      vi.mocked(authService.createUser).mockResolvedValue({ success: false, status: 400, msg: "Name is required" });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "test@test.com", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("returns 400 for invalid email", async () => {
      vi.mocked(authService.createUser).mockResolvedValue({ success: false, status: 400, msg: "Invalid email" });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ name: "Test", email: "not-an-email", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("logs in with valid credentials", async () => {
      vi.mocked(authService.authenticateUser).mockResolvedValue({
        success: true,
        status: 200,
        data: { id: "user_1", name: "Test", email: "test@test.com", accessToken: "mock_access", refreshToken: "mock_refresh" },
      });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@test.com", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 for missing password", async () => {
      vi.mocked(authService.authenticateUser).mockResolvedValue({ success: false, status: 400, msg: "Password is required" });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "test@test.com" });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("returns current user", async () => {
      vi.mocked(authService.getCurrentUser).mockResolvedValue({ success: true, status: 200, data: { id: "user_1", name: "Test", email: "test@test.com" } });

      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 500 when service throws", async () => {
      vi.mocked(authService.getCurrentUser).mockRejectedValue(new Error("USER_NOT_FOUND"));

      const res = await request(app).get("/api/v1/auth/me");

      expect(res.status).toBe(500);
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("refreshes token with valid payload", async () => {
      vi.mocked(authService.refreshToken).mockResolvedValue({
        success: true,
        status: 200,
        data: { accessToken: "new_access", refreshToken: "new_refresh" },
      });

      const res = await request(app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "mock_refresh" });

      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/v1/auth/google", () => {
    it("redirects to Google OAuth", async () => {
      const res = await request(app).get("/api/v1/auth/google");
      expect(res.status).toBe(302);
    });
  });

  describe("GET /api/v1/auth/github", () => {
    it("redirects to GitHub OAuth", async () => {
      const res = await request(app).get("/api/v1/auth/github");
      expect(res.status).toBe(302);
    });
  });
});
