import { Response } from "express";
import { NODE_ENV } from "../config/env";

export interface ErrorDetail {
  path?: (string | number)[];
  message: string;
}

export interface ErrorResponse {
  success: false;
  status: number;
  msg: string;
  errors?: ErrorDetail[];
}

export interface SuccessResponse<T = unknown> {
  success: true;
  status: number;
  msg: string;
  data: T;
}

export type APIResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

export const sendResponse = <T>(res: Response, payload: APIResponse<T>) => {
  return res.status(payload.status).json(payload);
};

export const setCookie = (
  res: Response,
  name: string,
  value: string,
  options?: Record<string, any>,
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 1000 * 60 * 15,
    ...options,
  });
};

export const redirect = (res: Response, url: string, status = 303) => {
  return res.redirect(status, url);
};
