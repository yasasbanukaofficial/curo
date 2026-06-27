import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { IEnvironment } from "../types/environment";
import { environmentService } from "../services";

export const getEnvironmentById = async (req: AuthRequest, res: Response) => {
  const { environmentId } = req.params as { environmentId: string };
  const userId = req.userId!;

  if (!environmentId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide an environment ID",
    });
  }

  try {
    const env = await environmentService.getEnvironmentById(userId, environmentId);
    if (!env) {
      return sendResponse(res, {
        success: false,
        status: 404,
        msg: "Environment not found or you don't have access to it",
      });
    }
    return sendResponse(res, {
      success: true,
      status: 200,
      data: env,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while loading the environment. Please try again.",
    });
  }
};

export const getAllEnvironments = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const allEnvs = await environmentService.getAllEnvironments(userId);
    return sendResponse(res, {
      success: true,
      status: 200,
      data: allEnvs,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while loading environments. Please try again.",
    });
  }
};

export const createEnvironment = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const body = req.body;

  if (!body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide the environment details",
    });
  }

  try {
    const isCreated = await environmentService.createEnvironment(
      userId,
      body as IEnvironment,
    );

    if (isCreated) {
      return sendResponse(res, {
        success: true,
        status: 201,
        msg: "Environment created successfully",
      });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Environment name and project are required",
      });
    }

    if (error.message === "DUPLICATE_ENVIRONMENT") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: `An environment named "${body?.name}" already exists in this project`,
      });
    }

    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while creating the environment. Please try again.",
    });
  }
};

export const updateEnvironment = async (req: AuthRequest, res: Response) => {
  const { environmentId } = req.params as { environmentId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!environmentId || !body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: !body ? "Request body is required" : "Environment ID is required",
    });
  }

  try {
    await environmentService.updateEnvironment(userId, environmentId, body);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Environment updated successfully",
    });
  } catch (error: any) {
    if (error.message === "ENVIRONMENT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Environment not found or you don't have access to it" });
    }
    if (error.code === 11000) {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: `An environment named "${body?.name}" already exists in this project`,
      });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while updating the environment. Please try again." });
  }
};

export const deleteEnvironment = async (req: AuthRequest, res: Response) => {
  const { environmentId } = req.params as { environmentId: string };
  const userId = req.userId!;

  if (!environmentId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Environment ID is required",
    });
  }

  try {
    await environmentService.deleteEnvironment(userId, environmentId);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Environment deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "ENVIRONMENT_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Environment not found or you don't have access to it" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while deleting the environment. Please try again." });
  }
};
