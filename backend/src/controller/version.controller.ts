import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { versionService } from "../services";

export const getAllVersions = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { secretId } = req.params as { secretId: string };

  if (!secretId) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Please provide a secret ID",
    });
  }

  try {
    const versions = await versionService.getAllVersions(userId, secretId);
    return sendResponse(res, {
      success: true,
      status: 200,
      data: versions,
    });
  } catch (error: any) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while loading version history. Please try again.",
    });
  }
};

export const createVersion = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { secretId, secKey } = req.body;

  if (!secretId || !secKey) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Secret ID and secret key are required",
    });
  }

  try {
    const isSaved = await versionService.createVersion(userId, secretId, secKey);

    if (isSaved) {
      return sendResponse(res, {
        success: true,
        status: 201,
        msg: "Version created successfully",
      });
    }
  } catch (error: any) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Something went wrong while creating the version. Please try again.",
    });
  }
};
