import { Request, Response } from "express";
import { unifiedEventService } from "../services";
import asyncHandler from "express-async-handler";
import { AppError } from "../middlewares";
import { sendResponse } from "../util";

export const fetchGithubData = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, "User not authenticated");
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
