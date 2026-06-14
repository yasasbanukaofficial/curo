import { model, Schema } from "mongoose";
import { IUnifiedEvent } from "../types";

const _unifiedEventSchema = new Schema<IUnifiedEvent>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["github", "slack", "calendar", "clickup", "whatsapp"],
      required: true,
    },
    type: {
      type: String,
      enum: ["message", "commit", "task", "event", "pr", "comment"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    entities: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
    embedding: {
      type: [Number],
      default: null,
    },
  },
  { timestamps: true },
);

_unifiedEventSchema.index({ userId: 1, source: 1, type: 1 });

export const UnifiedEventModel = model<IUnifiedEvent>(
  "UnifiedEvent",
  _unifiedEventSchema,
);
