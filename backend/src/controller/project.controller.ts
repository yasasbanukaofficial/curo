import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { IProject } from "../types/project";
import { projectService } from "../services";

export const getProjectById = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const userId = req.userId!;

    if (!projectId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide a project ID",
    });
  }

  try {
    const project = await projectService.getProjectById(userId, projectId);
    if (!project) {
      return sendResponse(res, {
        success: false,
        status: 404,
        msg: "Project not found or you don't have access to it",
      });
    }
    return sendResponse(res, {
      success: true,
      status: 200,
      data: project,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while loading the project. Please try again.",
    });
  }
};

export const getAllProjects = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const allProjects = await projectService.getAllProjects(userId);
    return sendResponse(res, {
      success: true,
      status: 200,
      data: allProjects,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while loading your projects. Please try again.",
    });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const body = req.body;

  if (!body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide the project details",
    });
  }

  try {
    const created = await projectService.createProject(
      userId,
      body as IProject,
    );

    if (created) {
      return sendResponse(res, {
        success: true,
        status: 201,
        msg: "Project created successfully",
        data: created,
      });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Project name and description are required",
      });
    }

    if (error.message === "INVALID_PROJECT_LINK") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Project link must be a valid URL",
      });
    }

    if (error.message === "DUPLICATE_PROJECT") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: `A project named "${body?.projectName}" already exists`,
      });
    }

    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while creating the project. Please try again.",
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
    if (error.message === "PROJECT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Project not found or you don't have access to it" });
    }
    if (error.code === 11000) {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: `A project named "${body?.projectName}" already exists`,
      });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while updating the project. Please try again." });
  }
};

export const addTeamToProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const { teamId } = req.body as { teamId: string };
  const userId = req.userId!;

  if (!projectId || !teamId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Project ID and Team ID are required",
    });
  }

  try {
    await projectService.addTeamToProject(userId, projectId, teamId);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Team assigned to project successfully",
    });
  } catch (error: any) {
    if (error.message === "PROJECT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Project not found or you don't have access to it" });
    }
    if (error.message === "TEAM_ALREADY_ASSIGNED") {
      return sendResponse(res, { success: false, status: 400, msg: "Team is already assigned to this project" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong. Please try again." });
  }
};

export const removeTeamFromProject = async (req: AuthRequest, res: Response) => {
  const { projectId, teamId } = req.params as { projectId: string; teamId: string };
  const userId = req.userId!;

  if (!projectId || !teamId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Project ID and Team ID are required",
    });
  }

  try {
    await projectService.removeTeamFromProject(userId, projectId, teamId);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Team removed from project successfully",
    });
  } catch (error: any) {
    if (error.message === "PROJECT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Project not found or you don't have access to it" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong. Please try again." });
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
    if (error.message === "PROJECT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Project not found or you don't have access to it" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while deleting the project. Please try again." });
  }
};
