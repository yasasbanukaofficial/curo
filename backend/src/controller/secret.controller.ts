import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { ISecret } from "../types/secret";
import { secretService } from "../services/secret.service";

export const createSecret = async (req: AuthRequest, res: Response) => {
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
    const isSaved = await secretService.saveSecretToDB(userId, body as ISecret);

    if (isSaved) {
      return sendResponse(res, {
        success: true,
        status: 201,
        msg: "Secret is successfully created",
      });
    }
  } catch (error: any) {
    if (error.message === "INVALID_PAYLOAD") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "secName, secKey, and projectId are required",
      });
    }

    if (error.message === "DUPLICATE_SECRET") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "A secret with this name already exists for your account",
      });
    }

    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Internal server error while saving secret",
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
    const status = error.message === "SECRET_NOT_FOUND" ? 404 : 500;
    return sendResponse(res, {
      success: false,
      status,
      msg: error.message,
    });
  }
};

export const deleteSecret = async (req: AuthRequest, res: Response) => {
  const { secretId } = req.params as { secretId: string };
  const userId = req.userId!;

  if (!secretId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Secret ID is required",
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
    const status = error.message === "SECRET_NOT_FOUND" ? 404 : 500;
    return sendResponse(res, {
      success: false,
      status,
      msg: error.message,
    });
  }
};
