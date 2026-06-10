import { Response } from "express";

export interface ErrorResponse {
  success: false;
  status: number;
  msg?: string;
}

export interface SuccessResponse<T> {
  success: true;
  status?: number;
  msg?: string;
  data?: T;
}

export type APIResponse<T> = SuccessResponse<T> | ErrorResponse;

export const sendResponse = <T>(res: any, payload: APIResponse<T>) => {
  return res.status(payload.status ?? 200).json(payload);
};

export const setCookie = (
  res: any,
  name: string,
  value: string,
  options?: Record<string, any>,
) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 10,
    ...options,
  });
};

export const redirect = (res: any, url: string, status = 303) => {
  return res.redirect(status, url);
};
