import { model, Schema } from "mongoose";
import { IEnvironment } from "../types/environment";

export const _environmentSchema = new Schema<IEnvironment>(
  {
    name: {
      type: String,
      required: [true, "Environment name is required"],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true },
);

_environmentSchema.index({ name: 1, projectId: 1 }, { unique: true });

export const EnvironmentModel = model<IEnvironment>("Environment", _environmentSchema);
