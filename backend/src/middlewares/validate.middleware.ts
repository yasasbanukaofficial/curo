import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod/v3";
import { sendResponse } from "../util";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body || {});

    if (!result.success) {
      return sendResponse(res, {
        success: false,
        status: 400,
        msg: result.error.issues[0].message,
      });
    }

    req.body = result.data;
    next();
  };
