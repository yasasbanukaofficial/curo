import { vi } from "vitest";
import express from "express";
import cookieParser from "cookie-parser";
import { AuthRouter, SecretRouter, ProjectRouter, EnvironmentRouter, TeamRouter, UserRouter } from "../src/routes/index";

vi.mock("../src/middlewares/auth.middleware", () => ({
  authenticate: vi.fn((_req: any, _res: any, next: any) => {
    _req.userId = "mock_user_id";
    _req.userEmail = "mock@user.com";
    next();
  }),
}));

vi.mock("../src/middlewares/validate.middleware", async () => {
  const actual = await vi.importActual("../src/middlewares/validate.middleware");
  return {
    ...actual,
    validateProjectAccess: vi.fn((_req: any, _res: any, next: any) => {
      _req.project = { _id: _req.params.projectId, projectName: "Mock", userId: "mock_user_id", teamId: null };
      _req.member = { role: "owner" };
      next();
    }),
  };
});

function chainableQuery(result: any) {
  return {
    lean: vi.fn().mockResolvedValue(result),
    sort: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue(result),
  };
}

vi.mock("../src/models/teamMember.model", () => ({
  TeamMemberModel: {
    find: vi.fn().mockReturnValue(chainableQuery([])),
    findOne: vi.fn().mockReturnValue(chainableQuery(null)),
    findByIdAndDelete: vi.fn().mockResolvedValue(true),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    findByIdAndUpdate: vi.fn().mockResolvedValue(true),
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

vi.mock("../src/models/project.model", () => ({
  ProjectModel: {
    findById: vi.fn().mockReturnValue(chainableQuery(null)),
    find: vi.fn().mockReturnValue(chainableQuery([])),
    findByIdAndUpdate: vi.fn().mockResolvedValue(true),
    findByIdAndDelete: vi.fn().mockResolvedValue(true),
    create: vi.fn().mockResolvedValue({ toObject: () => ({}) }),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

vi.mock("../src/models/secrets.model", () => ({
  SecretsModel: {
    find: vi.fn().mockReturnValue(chainableQuery([])),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    countDocuments: vi.fn().mockResolvedValue(0),
  },
}));

vi.mock("../src/models/environment.model", () => ({
  EnvironmentModel: {
    find: vi.fn().mockReturnValue(chainableQuery([])),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 0 }),
    countDocuments: vi.fn().mockResolvedValue(0),
  },
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

  app.use("/api/v1/teams", TeamRouter);
  app.use("/api/v1/users", UserRouter);
  return app;
}
