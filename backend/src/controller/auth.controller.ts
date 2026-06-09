import { Request, Response } from "express";
import { IUser } from "../types";
import { authService } from "../services";
import { sendResponse } from "../util";

export const register = async (req: Request<{}, {}, IUser>, res: Response) => {
  const result = await authService.register(req.body);
  sendResponse(res, result);
};

export const login = async (req: Request<{}, {}, IUser>, res: Response) => {
  const result = await authService.login(req.body);
  sendResponse(res, result);
};
