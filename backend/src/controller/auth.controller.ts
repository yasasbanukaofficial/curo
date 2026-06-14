import { Request, Response } from "express";
import { IUser } from "../types";
import { authService } from "../services";
import { redirect, sendResponse, setCookie } from "../util";
import { google } from "googleapis";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  FRONTEND_URL,
} from "../config/env";

export const oauth2Client = new google.auth.OAuth2(
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
);

const scopes = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/calendar",
];

export const register = async (req: Request<{}, {}, IUser>, res: Response) => {
  const result = await authService.register(req.body);
  return sendResponse(res, result);
};

export const login = async (req: Request<{}, {}, IUser>, res: Response) => {
  const result = await authService.login(req.body);
  return sendResponse(res, result);
};

export const googleLogin = (req: Request, res: Response) => {
  const state = crypto.randomUUID();
  setCookie(res, "oauth_state", state);
  const authUri = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state,
  });

  res.redirect(authUri);
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Authorization code is missing or invalid.",
      });
    }

    if (state !== req.cookies.oauth_state) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Invalid oauth state",
      });
    }

    const resp = await authService.googleCallback(code);
    setCookie(res, "token", resp.accessToken);

    return redirect(res, `${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "OAuth failed",
    });
  }
};
