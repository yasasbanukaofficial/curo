import { IUser } from "../types";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
} from "../config/env";

const SECRET_KEY = JWT_SECRET as string;
const ACCESS_EXPIRY = (JWT_ACCESS_EXPIRY ??
  "15m") as jwt.SignOptions["expiresIn"];
const REFRESH_EXPIRY = (JWT_REFRESH_EXPIRY ??
  "7d") as jwt.SignOptions["expiresIn"];

export const tokenGen = {
  genAccessToken: (user: IUser) =>
    generateToken(user, SECRET_KEY, ACCESS_EXPIRY),
  genRefreshToken: (user: IUser) =>
    generateToken(user, SECRET_KEY, REFRESH_EXPIRY),
  verify: (token: string) => verifyToken(token),
};

const generateToken = (
  user: IUser,
  secret: string,
  expiresIn: jwt.SignOptions["expiresIn"],
) => {
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
