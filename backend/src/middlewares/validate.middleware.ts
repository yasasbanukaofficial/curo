import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { sendResponse } from "../util";
import { AuthRequest } from "./auth.middleware";
import { ProjectModel, TeamMemberModel } from "../models";
import type { TeamRole } from "../types/teamMember";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body || {});

    if (!result.success) {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: result.error.issues[0].message,
      });
    }

    req.body = result.data;
    next();
  };

export const validateProjectAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const projectId = req.params.projectId;
  const userId = req.userId!;

  if (!projectId) {
    return sendResponse(res, { success: false, status: 400, msg: "Project ID is required" });
  }

  const project = await ProjectModel.findById(projectId).lean();
  if (!project) {
    return sendResponse(res, { success: false, status: 404, msg: "Project not found" });
  }

  if (project.userId?.toString() === userId) {
    (req as any).project = project;
    (req as any).member = { role: "owner" };
    return next();
  }

  const member = await TeamMemberModel.findOne({
    userId,
    teamId: { $in: project.teams || [] },
    status: "active",
  }).lean();

  if (!member) {
    return sendResponse(res, { success: false, status: 403, msg: "Access denied" });
  }

  (req as any).project = project;
  (req as any).member = member;
  next();
};

export const validateRole = (...allowedRoles: TeamRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const member = (req as any).member;

    if (!member) {
      return sendResponse(res, {
        success: false,
        status: 403,
        msg: "You do not have permission to perform this action.",
      });
    }

    if (member.role === "owner") {
      return next();
    }

    if (!allowedRoles.includes(member.role)) {
      return sendResponse(res, {
        success: false,
        status: 403,
        msg: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};
