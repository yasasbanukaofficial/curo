import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../util/token";
import { sendResponse } from "../util";
import { UserModel } from "../models";
import { refreshTokenViaCookies } from "../controller/auth.controller";

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

    if (accessToken) {
      try {
        const decoded = verifyToken(accessToken);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
          return sendResponse(res, {
            success: false,
            status: 401,
            msg: "User not found",
          });
        }
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        return next();
      } catch {
      }
    }

    const refreshToken = req.cookies?.refreshtoken;
    if (!refreshToken) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Not authenticated",
      });
    }

    try {
      const { userId, userEmail } = await refreshTokenViaCookies(
        refreshToken,
        res,
      );
      req.userId = userId;
      req.userEmail = userEmail;
      return next();
    } catch (refreshError: any) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: refreshError.message,
      });
    }
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 401,
      msg: "Invalid or expired token",
    });
  }
};
