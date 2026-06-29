import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { userService } from "../services";
import { sendResponse } from "../util";

export const getOverviewStats = async (req: AuthRequest, res: Response) => {
  const result = await userService.getOverviewStats(req.userId!);
  return sendResponse(res, { success: true, status: 200, data: result });
};
