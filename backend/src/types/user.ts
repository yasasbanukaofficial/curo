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
  emailVerified: boolean;
  emailVerificationOTP?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordOTP?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}
