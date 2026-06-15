import { model, Schema } from "mongoose";
import { IEvent } from "../types";

const eventSchema = new Schema<IEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["github", "slack", "calendar", "clickup", "whatsapp"],
    },
    type: {
      type: String,
      required: true,
      enum: ["message", "commit", "task", "event", "pr", "comment"],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    entities: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

export const EventModel = model<IEvent>("Event", eventSchema);
