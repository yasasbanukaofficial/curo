import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshTokens: string[];
  googleId?: string;
  githubId?: string;
  googleRefreshToken?: string;
  githubAccessToken?: string;
  provider: string[];
  createdAt: Date;
  updatedAt: Date;
}
