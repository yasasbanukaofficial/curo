import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { createTestApp } from "./setup";

vi.mock("../src/services/auth.service", () => ({
  authService: {
    createUser: vi.fn(),
    authenticateUser: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
    logoutUser: vi.fn(),
    deleteAccount: vi.fn(),
    updateProfile: vi.fn(),
    sendPasswordResetLink: vi.fn(),
    verifyResetToken: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
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

  describe("DELETE /api/v1/auth/account", () => {
    it("deletes account successfully", async () => {
      vi.mocked(authService.deleteAccount).mockResolvedValue({ success: true, status: 200, msg: "Account deleted successfully" });

      const res = await request(app).delete("/api/v1/auth/account");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when account not found", async () => {
      vi.mocked(authService.deleteAccount).mockResolvedValue({ success: false, status: 404, msg: "Account not found" });

      const res = await request(app).delete("/api/v1/auth/account");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/v1/auth/profile", () => {
    it("updates profile with valid name", async () => {
      vi.mocked(authService.updateProfile).mockResolvedValue({ success: true, status: 200, msg: "Profile updated successfully", data: { id: "user_1", name: "Updated", email: "test@test.com" } });

      const res = await request(app)
        .put("/api/v1/auth/profile")
        .send({ name: "Updated" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe("Updated");
    });

    it("returns 404 when user not found", async () => {
      vi.mocked(authService.updateProfile).mockResolvedValue({ success: false, status: 404, msg: "Account not found" });

      const res = await request(app)
        .put("/api/v1/auth/profile")
        .send({ name: "Ghost" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("logs out successfully", async () => {
      vi.mocked(authService.logoutUser).mockResolvedValue({ success: true, status: 200, msg: "Logged out successfully" });

      const res = await request(app).post("/api/v1/auth/logout");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe("POST /api/v1/auth/send-reset-link", () => {
    it("sends password reset link for valid user", async () => {
      vi.mocked(authService.sendPasswordResetLink).mockResolvedValue({ success: true, status: 200, msg: "Password reset link sent to your email." });

      const res = await request(app).post("/api/v1/auth/send-reset-link");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 when user not found", async () => {
      vi.mocked(authService.sendPasswordResetLink).mockResolvedValue({ success: false, status: 404, msg: "Account not found" });

      const res = await request(app).post("/api/v1/auth/send-reset-link");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/forgot-password", () => {
    it("sends reset email for existing user", async () => {
      vi.mocked(authService.forgotPassword).mockResolvedValue({ success: true, status: 200, msg: "Password reset email sent. Check your inbox." });

      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "test@test.com" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 404 for unknown email", async () => {
      vi.mocked(authService.forgotPassword).mockResolvedValue({ success: false, status: 404, msg: "This account doesn't exist. Try a different email." });

      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({ email: "unknown@test.com" });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/auth/reset-password/:token", () => {
    it("verifies a valid token", async () => {
      vi.mocked(authService.verifyResetToken).mockResolvedValue({ success: true, status: 200, msg: "Token is valid" });

      const res = await request(app).get("/api/v1/auth/reset-password/validtoken123");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("rejects invalid or expired token", async () => {
      vi.mocked(authService.verifyResetToken).mockResolvedValue({ success: false, status: 400, msg: "This reset link has expired or is invalid. Please request a new one." });

      const res = await request(app).get("/api/v1/auth/reset-password/badtoken");

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/reset-password", () => {
    it("resets password with valid token", async () => {
      vi.mocked(authService.resetPassword).mockResolvedValue({ success: true, status: 200, msg: "Password reset successfully" });

      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: "validtoken", password: "newPass123" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("rejects invalid token", async () => {
      vi.mocked(authService.resetPassword).mockResolvedValue({ success: false, status: 400, msg: "This reset link has expired or is invalid. Please request a new one." });

      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({ token: "badtoken", password: "newPass123" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
