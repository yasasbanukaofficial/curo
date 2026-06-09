import { Document } from "mongoose";

export interface IOAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

export interface IConnection extends Document {
  source: "github" | "slack" | "calendar" | "clickup" | "whatsapp";
  tokens: IOAuthTokens;
  connectionStatus: "connected" | "disconnected";
  createdAt: Date;
  updatedAt: Date;
}
