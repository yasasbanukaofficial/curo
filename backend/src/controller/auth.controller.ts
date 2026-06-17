import { Request, Response } from "express";
import { IUser } from "../types";
import { authService } from "../services";
import { redirect, sendResponse, setCookie } from "../util";
import { oauth2Client, GOOGLE_SCOPES } from "../integrations";
import { FRONTEND_URL, GITHUB_OAUTH_CLIENT_ID } from "../config/env";
import { AuthRequest } from "../middlewares";

export const register = async (req: Request<{}, {}, IUser>, res: Response) => {
  const result = await authService.register(req.body);
  return sendResponse(res, result);
};

export const login = async (req: Request<{}, {}, IUser>, res: Response) => {
  const result = await authService.login(req.body);
  if (result.success && result.data) {
    setCookie(res, "Access_token", result.data.accessToken);
    setCookie(res, "refreshtoken", result.data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
  return sendResponse(res, result);
};

export const googleLogin = (req: Request, res: Response) => {
  const state = crypto.randomUUID();
  setCookie(res, "oauth_state", state);
  const authUri = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_SCOPES,
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
        msg: "Authorization code is missing or invalid | Google",
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
    setCookie(res, "Access_token", resp.accessToken);
    setCookie(res, "refreshtoken", resp.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return redirect(res, `${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "OAuth failed",
    });
  }
};

export const githubLogin = (req: Request, res: Response) => {
  const state = crypto.randomUUID();
  setCookie(res, "github_oauth_state", state);

  const url = "https://github.com/login/oauth/authorize";
  const params = new URLSearchParams([
    ["client_id", GITHUB_OAUTH_CLIENT_ID || ""],
    ["scope", "read:user user:email"],
    ["state", state],
  ]);

  res.redirect(`${url}?${params}`);
};

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    if (!code || typeof code !== "string") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Authorization code is missing or invalid | Github",
      });
    }

    if (state !== req.cookies.github_oauth_state) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Invalid oauth state",
      });
    }

    const resp = await authService.githubCallback(code);
    setCookie(res, "Access_token", resp.accessToken);
    setCookie(res, "refreshtoken", resp.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return redirect(res, `${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "OAuth failed",
    });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await authService.refresh(refreshToken);
  return sendResponse(res, result);
};

export const me = async (req: AuthRequest, res: Response) => {
  const result = await authService.me(req.userId!);
  return sendResponse(res, result);
};
