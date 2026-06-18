import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { ISecret } from "../types/secret";
import { secretService } from "../services/secret.service";

export const saveSecret = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const body = req.body;

  if (!userId) {
    return sendResponse(res, {
      success: false,
      status: 401,
      msg: "Unauthorized",
    });
  }

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

    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Internal server error while saving secret",
    });
  }
};

export const updateSecret = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
};
