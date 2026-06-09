import { model, Schema } from "mongoose";
import { IConnection } from "../types";

export const _connectionModel = new Schema<IConnection>(
  {
    source: {
      type: String,
      enum: ["github", "slack", "calendar", "clickup", "whatsapp"],
      required: true,
    },
    tokens: {
      accessToken: {
        type: String,
        required: true,
      },
      refreshToken: String,
      expiresAt: Date,
    },
    connectionStatus: {
      type: String,
      enum: ["connected", "disconnected"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ConnectionModel = model<IConnection>(
  "Connection",
  _connectionModel,
);
