import { model, Schema } from "mongoose";
import { ISecret } from "../types/secret";

export const _secretSchema = new Schema<ISecret>({
  secName: {
    type: String,
    required: [true, "Secret Name is required"],
    minLength: [2, "Secret Key name is too short"],
  },
  secKey: {
    type: String,
    required: [true, "Secret Key is required"],
    minLength: [2, "Secret Key is too short"],
  },
  projectId: {
    type: Schema.Types.ObjectId,
    required: [true, "Project ID is required"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "User ID is required"],
  },
  environmentId: {
    type: Schema.Types.ObjectId,
    ref: "Environment",
    required: false,
  },
});

_secretSchema.index({ secName: 1, userId: 1 }, { unique: true });

export const SecretsModel = model<ISecret>("Secrets", _secretSchema);
