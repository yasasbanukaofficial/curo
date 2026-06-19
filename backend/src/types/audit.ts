import { Types } from "mongoose";

export interface IAudit {
  userId: Types.ObjectId;
  action: "CREATED" | "UPDATED" | "DELETED" | "VIEWED";
  resource: "SECRET";
  metadata: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
