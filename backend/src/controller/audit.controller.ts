import { Response } from "express";
import { sendResponse } from "../util";
import { AuthRequest } from "../middlewares";
import { auditService } from "../services";

export const getAllAudits = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const auditLogs = await auditService.getAllAudits(userId);
    return sendResponse(res, {
      success: true,
      status: 200,
      data: auditLogs,
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 500,
      msg: "Internal server error while fetching audit logs",
    });
  }
};
