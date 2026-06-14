import { Request, Response } from "express";
import { authService } from "../services";
import { redirect, sendResponse, setCookie } from "../util";
import { oauth2Client, GOOGLE_SCOPES } from "../integrations";
import { FRONTEND_URL, GITHUB_OAUTH_CLIENT_ID } from "../config/env";
import asyncHandler from "express-async-handler";

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  setCookie(res, "accessToken", accessToken);
  setCookie(res, "refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/v1/auth/refresh",
  });
};

export const register = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    return sendResponse(res, result);
  },
);

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    if (!result.success) {
      return sendResponse(res, result);
    }
    const { accessToken, refreshToken, ...userData } = result.data;
    setAuthCookies(res, accessToken, refreshToken);
    return sendResponse(res, {
      success: true,
      status: 200,
      msg: "Login successful",
      data: userData,
    });
  },
);

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

export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Authorization code is missing or invalid",
      });
    }

    if (state !== req.cookies.oauth_state) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Invalid OAuth state",
      });
    }

    const resp = await authService.googleCallback(code);
    setAuthCookies(res, resp.accessToken, resp.refreshToken);

    return redirect(res, `${FRONTEND_URL}/dashboard`);
  },
);

export const githubLogin = (req: Request, res: Response) => {
  const state = crypto.randomUUID();
  setCookie(res, "github_oauth_state", state);

  const url = "https://github.com/login/oauth/authorize";
  const params = new URLSearchParams([
    ["client_id", GITHUB_OAUTH_CLIENT_ID || ""],
    ["scope", "public_repo read:user user:email notifications"],
    ["state", state],
  ]);

  res.redirect(`${url}?${params}`);
};

export const githubCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Authorization code is missing or invalid",
      });
    }

    if (state !== req.cookies.github_oauth_state) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Invalid OAuth state",
      });
    }

    const resp = await authService.githubCallback(code);
    setAuthCookies(res, resp.accessToken, resp.refreshToken);

    return redirect(res, `${FRONTEND_URL}/dashboard`);
  },
);
