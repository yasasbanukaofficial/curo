import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../util/token";
import { sendResponse } from "../util";
import { UserModel } from "../models";

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Your session has expired. Please log in again.",
      });
    }

    const decoded = verifyToken(accessToken);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Your session has expired. Please log in again.",
      });
    }

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    return next();
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 401,
      msg: "Your session has expired. Please log in again.",
    });
  }
};
