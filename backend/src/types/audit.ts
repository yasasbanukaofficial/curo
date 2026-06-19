import { Types } from "mongoose";

export interface IAudit {
  userId: Types.ObjectId;
  action: "CREATED" | "UPDATED" | "DELETED";
  resource: "SECRET" | "PROJECT" | "ENVIRONMENT";
  metadata: Record<string, any>;
}
