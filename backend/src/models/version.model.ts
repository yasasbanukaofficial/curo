import { model, Schema } from "mongoose";
import { IVersion } from "../types/version";

export const _versionSchema = new Schema<IVersion>(
  {
    secretId: {
      type: Schema.Types.ObjectId,
      ref: "Secret",
      required: [true, "Secret ID is required"],
    },
    secKey: {
      type: String,
      required: [true, "Secret key is required"],
    },
    version: {
      type: Number,
      required: [true, "Version number is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  { timestamps: true },
);

_versionSchema.index({ secretId: 1, version: -1 });

export const VersionModel = model<IVersion>("Version", _versionSchema);
