import { NextFunction, Request, Response } from "express";
import { setCookie } from "../util/apiResponse";
import { tokenGen, verifyToken } from "../util/token";
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
    const accessToken = req.cookies?.Access_token;

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
        // Access token invalid/expired, fall through to refresh
      }
    }

    const refreshToken = req.cookies?.refreshtoken;
    if (!refreshToken) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Access token is required",
      });
    }

    const decoded = verifyToken(refreshToken);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "User not found",
      });
    }

    const tokenExists = user.refreshTokens.includes(refreshToken);
    if (!tokenExists) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Invalid refresh token",
      });
    }

    const newAccessToken = tokenGen.genAccessToken(user);
    const newRefreshToken = tokenGen.genRefreshToken(user);

    await UserModel.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: refreshToken },
      $push: { refreshTokens: newRefreshToken },
    });

    setCookie(res, "Access_token", newAccessToken);
    setCookie(res, "refreshtoken", newRefreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    req.userId = user._id.toString();
    req.userEmail = user.email;
    next();
  } catch (error) {
    return sendResponse(res, {
      success: false,
      status: 401,
      msg: "Invalid or expired token",
    });
  }
};
