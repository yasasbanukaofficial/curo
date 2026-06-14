import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { AppError } from "./error.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new AppError(401, "Access token is required");
  }

  const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string };
  req.user = { id: decoded.id };
  next();
};
