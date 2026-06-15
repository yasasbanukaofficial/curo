import { NextFunction, Response } from "express";
import { tokenGen } from "../util/token";
import { AuthRequest } from "../types/auth";
import { handleRefreshToken } from "../controller";
import { setCookie } from "../util";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken || typeof refreshToken !== "string") {
        return res.status(401).json({
          success: false,
          msg: "Authentication required",
        });
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await handleRefreshToken(refreshToken);

      setCookie(res, "accessToken", newAccessToken, {
        maxAge: 15 * 60 * 1000,
      });
      setCookie(res, "refreshToken", newRefreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      token = newAccessToken;
    }

    const data = tokenGen.verify(token);
    req.user = data;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      msg: error instanceof Error ? error.message : "Authentication failed",
    });
  }
};
