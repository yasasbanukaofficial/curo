import { Document } from "mongoose";

export type EventSource = "github" | "slack" | "calendar" | "clickup" | "whatsapp";

export type EventType = "message" | "commit" | "task" | "event" | "pr" | "comment";

export interface IUnifiedEvent extends Document {
  userId: string;
  source: EventSource;
  type: EventType;
  content: string;
  entities: string[];
  timestamp: Date;
  metadata?: Record<string, unknown>;
  embedding?: number[] | null;
  createdAt: Date;
  updatedAt: Date;
}
