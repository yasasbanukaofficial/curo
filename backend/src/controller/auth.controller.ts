import { Request, Response } from "express";
import { IUser } from "../types";
import { authService } from "../services";
import { redirect, sendResponse, setCookie, verifyToken } from "../util";
import { oauth2Client, GOOGLE_SCOPES } from "../integrations";
import { FRONTEND_URL, GITHUB_OAUTH_CLIENT_ID } from "../config/env";
import { AuthRequest } from "../middlewares/auth.middleware";

export const registerUser = async (
  req: Request<{}, {}, IUser>,
  res: Response,
) => {
  const result = await authService.createUser(req.body);
  return sendResponse(res, result);
};

export const loginUser = async (req: Request<{}, {}, IUser>, res: Response) => {
  const result = await authService.authenticateUser(req.body);
  if (result.success && result.data) {
    setCookie(res, "access_token", result.data.accessToken);
    setCookie(res, "refreshtoken", result.data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
  return sendResponse(res, result);
};

export const initiateGoogleAuth = (req: Request, res: Response) => {
  const isConnect = req.path.includes("connect");
  const state = isConnect ? `connect_${crypto.randomUUID()}` : crypto.randomUUID();
  setCookie(res, "oauth_state", state);
  const authUri = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_SCOPES,
    state,
  });

  res.redirect(authUri);
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code || typeof code !== "string") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Unable to sign in with Google. Please try again.",
      });
    }

    if (state !== req.cookies.oauth_state) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Something went wrong with Google sign in. Please try again.",
      });
    }

    const isConnect = typeof state === "string" && state.startsWith("connect_");

    if (isConnect) {
      const accessToken = req.cookies?.access_token;
      if (!accessToken) {
        return redirect(res, `${FRONTEND_URL}/dashboard`);
      }
      const decoded = verifyToken(accessToken);
      await authService.linkGoogleAccount(code, decoded.id);
      return redirect(res, `${FRONTEND_URL}/dashboard`);
    }

    const resp = await authService.handleGoogleOAuth(code);
    setCookie(res, "access_token", resp.accessToken);
    setCookie(res, "refreshtoken", resp.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return redirect(res, `${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to sign in with Google. Please try again.",
    });
  }
};

export const initiateGithubAuth = (req: Request, res: Response) => {
  const isConnect = req.path.includes("connect");
  const state = isConnect ? `connect_${crypto.randomUUID()}` : crypto.randomUUID();
  setCookie(res, "github_oauth_state", state);

  const url = "https://github.com/login/oauth/authorize";
  const params = new URLSearchParams([
    ["client_id", GITHUB_OAUTH_CLIENT_ID || ""],
    ["scope", "read:user user:email"],
    ["state", state],
  ]);

  res.redirect(`${url}?${params}`);
};

export const handleGithubCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;
    if (!code || typeof code !== "string") {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: "Unable to sign in with GitHub. Please try again.",
      });
    }

    if (state !== req.cookies.github_oauth_state) {
      return sendResponse(res, {
        success: false,
        status: 401,
        msg: "Something went wrong with GitHub sign in. Please try again.",
      });
    }

    const isConnect = typeof state === "string" && state.startsWith("connect_");

    if (isConnect) {
      const accessToken = req.cookies?.access_token;
      if (!accessToken) {
        return redirect(res, `${FRONTEND_URL}/dashboard`);
      }
      const decoded = verifyToken(accessToken);
      await authService.linkGithubAccount(code, decoded.id);
      return redirect(res, `${FRONTEND_URL}/dashboard`);
    }

    const resp = await authService.handleGithubOAuth(code);
    setCookie(res, "access_token", resp.accessToken);
    setCookie(res, "refreshtoken", resp.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return redirect(res, `${FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to sign in with GitHub. Please try again.",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.cookies?.refreshtoken;
  if (!token) {
    return sendResponse(res, {
      success: false,
      status: 401,
      msg: "Your session has expired. Please log in again.",
    });
  }
  const result = await authService.refreshToken(token);
  if (result.success && result.data) {
    setCookie(res, "access_token", result.data.accessToken);
    setCookie(res, "refreshtoken", result.data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
  return sendResponse(res, result);
};

export const refreshTokenViaCookies = async (
  refreshToken: string,
  res: Response,
) => {
  const result = await authService.refreshToken(refreshToken);
  if (!result.success || !result.data) {
    throw new Error(result.msg || "Failed to refresh token");
  }

  setCookie(res, "access_token", result.data.accessToken);
  setCookie(res, "refreshtoken", result.data.refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return { userId: result.data.userId, userEmail: result.data.userEmail };
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const result = await authService.getCurrentUser(req.userId!);
  return sendResponse(res, result);
};

export const logoutUser = async (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies?.refreshtoken;
  const result = await authService.logoutUser(req.userId!, refreshToken);
  res.clearCookie("access_token");
  res.clearCookie("refreshtoken");
  res.clearCookie("oauth_state");
  res.clearCookie("github_oauth_state");
  return sendResponse(res, result);
};

export const verifyEmailOTP = async (req: AuthRequest, res: Response) => {
  const result = await authService.verifyEmailOTP(req.userId, req.body.otp, req.body.token);
  if (result.success && result.data) {
    setCookie(res, "access_token", result.data.accessToken);
    setCookie(res, "refreshtoken", result.data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
  return sendResponse(res, result);
};

export const verifyEmailToken = async (req: Request, res: Response) => {
  const result = await authService.verifyEmailToken(req.params.token);
  if (result.success && result.data) {
    setCookie(res, "access_token", result.data.accessToken);
    setCookie(res, "refreshtoken", result.data.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return redirect(res, `${FRONTEND_URL}/dashboard`);
  }
  return redirect(res, `${FRONTEND_URL}/verify-email?expired=1`);
};

export const resendVerification = async (req: AuthRequest, res: Response) => {
  const result = await authService.resendVerification(req.userId!);
  return sendResponse(res, result);
};

export const disconnectOAuth = async (req: AuthRequest, res: Response) => {
  const { provider } = req.body;
  const result = await authService.disconnectProvider(req.userId!, provider);
  return sendResponse(res, result);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body.email);
  return sendResponse(res, result);
};

export const resetPassword = async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req.body.token, req.body.password);
  return sendResponse(res, result);
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const result = await authService.updateProfile(req.userId!, req.body);
  return sendResponse(res, result);
};

export const verifyResetToken = async (req: Request, res: Response) => {
  const result = await authService.verifyResetToken(req.params.token);
  return sendResponse(res, result);
};

export const sendPasswordResetLink = async (req: AuthRequest, res: Response) => {
  const result = await authService.sendPasswordResetLink(req.userId!);
  return sendResponse(res, result);
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const result = await authService.changePassword(req.userId!, req.body.currentPassword, req.body.newPassword);
  return sendResponse(res, result);
};

export const markOnboardingComplete = async (req: AuthRequest, res: Response) => {
  const { skipped } = req.body;
  const result = await authService.markOnboardingComplete(req.userId!, skipped);
  return sendResponse(res, result);
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  const result = await authService.deleteAccount(req.userId!);
  res.clearCookie("access_token");
  res.clearCookie("refreshtoken");
  res.clearCookie("oauth_state");
  res.clearCookie("github_oauth_state");
  return sendResponse(res, result);
};
