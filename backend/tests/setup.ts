import { vi } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import { AuthRouter, SecretRouter, ProjectRouter, EnvironmentRouter, AuditRouter, TeamRouter } from "../src/routes/index";

vi.mock("../src/middlewares/auth.middleware", () => ({
  authenticate: vi.fn((_req: any, _res: any, next: any) => {
    _req.userId = "mock_user_id";
    _req.userEmail = "mock@user.com";
    next();
  }),
}));

process.env.API_VER = "v1";
process.env.JWT_SECRET = "test-secret";
process.env.MONGODB_URL = "mongodb://localhost:27017/test";
process.env.ENCRYPTION_KEY = "test-encryption-key-32-chars-long!!";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.NODE_ENV = "test";

export function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/auth", AuthRouter);
  app.use("/api/v1/secrets", SecretRouter);
  app.use("/api/v1/projects", ProjectRouter);
  app.use("/api/v1/environments", EnvironmentRouter);

  app.use("/api/v1/audits", AuditRouter);
  app.use("/api/v1/teams", TeamRouter);
  return app;
}
