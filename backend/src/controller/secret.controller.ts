import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { ISecret } from "../types";
import { secretService } from "../services";

export const createSecret = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const body = req.body;

  if (!body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide the secret details",
    });
  }

  try {
    const isSaved = await secretService.saveSecretToDB(userId, body as ISecret);

    if (isSaved) {
      return sendResponse(res, {
        success: true,
        status: 201,
        msg: "Secret created successfully",
      });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Secret name, secret key, and project are required",
      });
    }

    if (error.message === "DUPLICATE_SECRET") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: `A secret named "${body?.secName}" already exists${body?.environmentId ? " in this environment" : ""}`,
      });
    }

    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while saving the secret. Please try again.",
    });
  }
};

export const updateSecret = async (req: AuthRequest, res: Response) => {
  const { secretId } = req.params as { secretId: string };
  const userId = req.userId!;
  const body = req.body;

  if (!secretId || !body) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: !body ? "Request body is required" : "Secret ID is required",
    });
  }

  try {
    await secretService.updateSecretInDB(userId, secretId, body);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Secret updated successfully",
    });
  } catch (error: any) {
    if (error.message === "SECRET_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Secret not found or you don't have access to it" });
    }
    if (error.code === 11000) {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: `A secret named "${body?.secName}" already exists${body?.environmentId ? " in this environment" : ""}`,
      });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while updating the secret. Please try again." });
  }
};

export const deleteSecret = async (req: AuthRequest, res: Response) => {
  const { secretId } = req.params as { secretId: string };
  const userId = req.userId!;

  if (!secretId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide a secret ID",
    });
  }

  try {
    await secretService.deleteSecretInDB(userId, secretId);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Secret deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "SECRET_NOT_FOUND") {
      return sendResponse(res, { success: false, status: 404, msg: "Secret not found or you don't have access to it" });
    }
    return sendResponse(res, { success: false, status: 500, msg: "Something went wrong while deleting the secret. Please try again." });
  }
};

export const getSecretById = async (req: AuthRequest, res: Response) => {
  const { secretId } = req.params as { secretId: string };
  const userId = req.userId!;

  if (!secretId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide a secret ID",
    });
  }

  try {
    const secret = await secretService.getSecretById(userId, secretId);
    if (!secret) {
      return sendResponse(res, {
        success: false,
        status: 404,
        msg: "Secret not found or you don't have access to it",
      });
    }
    return sendResponse(res, {
      success: true,
      status: 200,
      data: secret,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while loading the secret. Please try again.",
    });
  }
};

export const getAllSecrets = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const allSecrets = await secretService.getAllSecrets(userId);
    return sendResponse(res, {
      success: true,
      status: 200,
      data: allSecrets,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while loading secrets. Please try again.",
    });
  }
};
