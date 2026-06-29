import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { IProject, ISecret, IEnvironment } from "../types";
import { projectService, secretService, environmentService } from "../services";
import { TeamMemberModel } from "../models";

export const getProjectById = async (req: AuthRequest, res: Response) => {
  const projectId = req.params.projectId;

  if (!projectId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide a project ID",
    });
  }

  try {
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return sendResponse(res, {
        success: false,
        status: 404,
        msg: "Project not found or you don't have access to it",
      });
    }
    const member = (req as any).member;
    return sendResponse(res, {
      success: true,
      status: 200,
      data: { ...project, role: member?.role ?? "viewer" },
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
  const teamId = req.query.teamId as string | undefined;

  try {
    const memberships = await TeamMemberModel.find({ userId, status: "active" }).lean();
    const teamIds = memberships.map((m) => m.teamId.toString());

    const allProjects = await projectService.getAllProjects(userId, teamIds, teamId);

    const projectsWithRole = allProjects.map((project) => {
      let role = "viewer";
      if (project.userId?.toString() === userId) {
        role = "owner";
      } else if (project.teamId) {
        const membership = memberships.find(
          (m) => m.teamId.toString() === project.teamId.toString(),
        );
        if (membership) role = membership.role;
      }
      return { ...project, role };
    });

    return sendResponse(res, {
      success: true,
      status: 200,
      data: projectsWithRole,
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
      body as IProject & { teamId?: string },
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
        msg: "Project name is required",
      });
    }

    if (error.message === "INVALID_PROJECT_LINK") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Project link must be a valid URL",
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
  const body = req.body;

  if (!projectId || !body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: !body ? "Request body is required" : "Project ID is required",
    });
  }

  try {
    await projectService.updateProject(projectId, body);
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

export const setProjectTeam = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const { teamId } = req.body as { teamId: string };

  if (!projectId || !teamId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Project ID and Team ID are required",
    });
  }

  try {
    await projectService.setProjectTeam(projectId, teamId);
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

export const unsetProjectTeam = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };

  if (!projectId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Project ID is required",
    });
  }

  try {
    await projectService.unsetProjectTeam(projectId);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Team removed from project successfully",
    });
  } catch (error: any) {
    if (error.message === "PROJECT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Project not found or you don't have access to it" });
    }
    if (error.message === "TEAM_NOT_ASSIGNED") {
      return sendResponse(res, { success: false, status: 400, msg: "No team is currently assigned to this project" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong. Please try again." });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };

  if (!projectId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Project ID is required",
    });
  }

  try {
    await projectService.deleteProject(projectId);
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

export const getAllProjectSecrets = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };

  if (!projectId) {
    return sendResponse(res, { success: false, status: 400, msg: "Project ID is required" });
  }

  try {
    const secrets = await secretService.getProjectSecrets(projectId);
    return sendResponse(res, { success: true, status: 200, data: secrets });
  } catch (error) {
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while loading secrets." });
  }
};

export const createProjectSecret = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const userId = req.userId!;
  const { environmentId, ...rest } = req.body;

  if (!rest) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the secret details" });
  }

  try {
    const created = await secretService.saveSecretToDB(userId, { ...rest, projectId, environmentId: environmentId || undefined } as ISecret);
    if (created) {
      return sendResponse(res, { success: true, status: 201, msg: "Secret created successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "Secret name and secret key are required" });
    }
    if (error.message === "DUPLICATE_SECRET") {
      return sendResponse(res, { success: false, status: 400, msg: `A secret named "${rest?.secName}" already exists in this project` });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while saving the secret." });
  }
};

export const updateProjectSecret = async (req: AuthRequest, res: Response) => {
  const { projectId, secretId } = req.params as { projectId: string; secretId: string };
  const { environmentId, ...rest } = req.body;

  if (!secretId || !rest) {
    return sendResponse(res, { success: false, status: 400, msg: !rest ? "Request body is required" : "Secret ID is required" });
  }

  try {
    await secretService.updateProjectSecret(projectId, secretId, { ...rest, environmentId: environmentId || undefined });
    return sendResponse(res, { success: true, status: 200, msg: "Secret updated successfully" });
  } catch (error: any) {
    if (error.message === "SECRET_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Secret not found" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while updating the secret." });
  }
};

export const deleteProjectSecret = async (req: AuthRequest, res: Response) => {
  const { projectId, secretId } = req.params as { projectId: string; secretId: string };
  const userId = req.userId!;
  const member = (req as any).member;

  if (!secretId) {
    return sendResponse(res, { success: false, status: 400, msg: "Secret ID is required" });
  }

  try {
    await secretService.deleteProjectSecret(projectId, secretId, userId, member?.role);
    return sendResponse(res, { success: true, status: 200, msg: "Secret deleted successfully" });
  } catch (error: any) {
    if (error.message === "SECRET_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Secret not found" });
    }
    if (error.message === "FORBIDDEN") {
      return sendResponse(res, { success: false, status: 403, msg: "You do not have permission to perform this action." });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while deleting the secret." });
  }
};

export const getAllProjectEnvironments = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };

  if (!projectId) {
    return sendResponse(res, { success: false, status: 400, msg: "Project ID is required" });
  }

  try {
    const environments = await environmentService.getProjectEnvironments(projectId);
    return sendResponse(res, { success: true, status: 200, data: environments });
  } catch (error) {
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while loading environments." });
  }
};

export const createProjectEnvironment = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!body) {
    return sendResponse(res, { success: false, status: 400, msg: "Please provide the environment details" });
  }

  try {
    const isCreated = await environmentService.createProjectEnvironment(
      userId, projectId, body as IEnvironment,
    );
    if (isCreated) {
      return sendResponse(res, { success: true, status: 201, msg: "Environment created successfully" });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, { success: false, status: 400, msg: "Environment name is required" });
    }
    if (error.message === "DUPLICATE_ENVIRONMENT") {
      return sendResponse(res, { success: false, status: 400, msg: `An environment named "${body?.name}" already exists in this project` });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while creating the environment." });
  }
};

export const updateProjectEnvironment = async (req: AuthRequest, res: Response) => {
  const { projectId, environmentId } = req.params as { projectId: string; environmentId: string };
  const body = req.body;

  if (!environmentId || !body) {
    return sendResponse(res, { success: false, status: 400, msg: !body ? "Request body is required" : "Environment ID is required" });
  }

  try {
    await environmentService.updateProjectEnvironment(projectId, environmentId, body);
    return sendResponse(res, { success: true, status: 200, msg: "Environment updated successfully" });
  } catch (error: any) {
    if (error.message === "ENVIRONMENT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Environment not found" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while updating the environment." });
  }
};

export const deleteProjectEnvironment = async (req: AuthRequest, res: Response) => {
  const { projectId, environmentId } = req.params as { projectId: string; environmentId: string };
  const userId = req.userId!;
  const member = (req as any).member;

  if (!environmentId) {
    return sendResponse(res, { success: false, status: 400, msg: "Environment ID is required" });
  }

  try {
    await environmentService.deleteProjectEnvironment(projectId, environmentId, userId, member?.role);
    return sendResponse(res, { success: true, status: 200, msg: "Environment deleted successfully" });
  } catch (error: any) {
    if (error.message === "ENVIRONMENT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Environment not found" });
    }
    if (error.message === "FORBIDDEN") {
      return sendResponse(res, { success: false, status: 403, msg: "You do not have permission to perform this action." });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while deleting the environment." });
  }
};
