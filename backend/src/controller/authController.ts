import { Request, Response } from "express";
import { IUser } from "../types";
import { sendResponse } from "../util/apiResponse";

const register = (req: Request<{}, {}, IUser>, res: Response) => {
  const user = req.body;

  sendResponse(res, {
    success: true,
    status: 201,
    msg: "Successfully created an user",
    data: { name: user.name, email: user.email },
  });
};

export { register };
