import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v3";
import { sendResponse, ErrorDetail } from "../util";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors?: ErrorDetail[];

  constructor(statusCode: number, message: string, errors?: ErrorDetail[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return sendResponse(res, {
      success: false,
      status: err.statusCode,
      msg: err.message,
      errors: err.errors,
    });
  }

  if (err instanceof ZodError) {
    return sendResponse(res, {
      success: false,
      status: 400,
      msg: "Validation failed",
      errors: err.issues.map((i) => ({ path: i.path, message: i.message })),
    });
  }

  console.error("[UNHANDLED ERROR]", err);

  return sendResponse(res, {
    success: false,
    status: 500,
    msg: "Internal server error",
  });
};
