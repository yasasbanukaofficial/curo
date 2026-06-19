import { model, Schema } from "mongoose";
import { IAudit } from "../types/audit";

export const _auditSchema = new Schema<IAudit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    action: {
      type: String,
      enum: ["CREATED", "UPDATED", "DELETED", "VIEWED"],
      required: [true, "Action is required"],
    },
    resource: {
      type: String,
      enum: ["SECRET"],
      required: [true, "Resource is required"],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

_auditSchema.index({ userId: 1, createdAt: -1 });

export const AuditModel = model<IAudit>("Audit", _auditSchema);
