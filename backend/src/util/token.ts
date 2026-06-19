import { IUser } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";
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
};

const generateToken = (
  user: IUser,
  secret: string,
  expiresIn: jwt.SignOptions["expiresIn"],
) => {
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn });
};

export const verifyToken = (token: string): { id: string; email: string } => {
  const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;
  if (!payload.id || !payload.email) {
    throw new jwt.JsonWebTokenError("Invalid token payload");
  }
  return { id: payload.id as string, email: payload.email as string };
};
