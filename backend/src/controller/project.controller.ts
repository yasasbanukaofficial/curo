import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { IProject } from "../types/project";
import { projectService } from "../services";

export const createProject = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const body = req.body;

  if (!body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Request body is required",
    });
  }

  try {
    const isCreated = await projectService.createProject(
      userId,
      body as IProject,
    );

    if (isCreated) {
      return sendResponse(res, {
        success: true,
        status: 201,
        msg: "Project created successfully",
      });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "projectName and description are required",
      });
    }

    if (error.message === "DUPLICATE_PROJECT") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "A project with this name already exists",
      });
    }

    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Internal server error while creating project",
    });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!projectId || !body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: !body ? "Request body is required" : "Project ID is required",
    });
  }

  try {
    await projectService.updateProject(userId, projectId, body);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Project updated successfully",
    });
  } catch (error: any) {
    const status = error.message === "PROJECT_NOT_FOUND" ? 404 : 500;
    return sendResponse(res, {
      success: false,
      status,
      msg: error.message,
    });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const userId = req.userId!;

  if (!projectId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Project ID is required",
    });
  }

  try {
    await projectService.deleteProject(userId, projectId);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Project deleted successfully",
    });
  } catch (error: any) {
    const status = error.message === "PROJECT_NOT_FOUND" ? 404 : 500;
    return sendResponse(res, {
      success: false,
      status,
      msg: error.message,
    });
  }
};
