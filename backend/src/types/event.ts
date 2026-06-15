import { Document, Types } from "mongoose";

export interface IEvent extends Document {
  userId: Types.ObjectId;
  source: "github" | "slack" | "calendar" | "clickup" | "whatsapp";
  type: "message" | "commit" | "task" | "event" | "pr" | "comment";
  content: string;
  entities: [string];
  timestamp: Date;
  metadata: any;
}
