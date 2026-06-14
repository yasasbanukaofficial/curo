import { Request, Response } from "express";
import { unifiedEventService } from "../services";
import asyncHandler from "express-async-handler";
import { AppError } from "../middlewares";
import { sendResponse } from "../util";

export const testGithubSync = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      throw new AppError(400, "userId is required");
    }

    const result = await unifiedEventService.syncGithubRepos(userId);

    return sendResponse(res, {
      success: true,
      status: 200,
      msg: `Synced ${result.reposSynced} repos and ${result.eventsSynced} events`,
      data: result,
    });
  },
);
