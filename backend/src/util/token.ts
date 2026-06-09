import { IUser } from "../types";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;
export const tokenGen = {
  genAccessToken: (user: IUser) => generateToken(user, SECRET_KEY, "15m"),

  genRefreshToken: (user: IUser) => generateToken(user, SECRET_KEY, "7d"),
};

const generateToken = (
  user: IUser,
  secret: string,
  expiresIn: jwt.SignOptions["expiresIn"],
) => {
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn });
};
