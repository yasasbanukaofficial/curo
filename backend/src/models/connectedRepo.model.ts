import { model, Schema } from "mongoose";
import { IConnectedRepo } from "../types";

const _connectedRepoSchema = new Schema<IConnectedRepo>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    repoId: {
      type: Number,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    htmlUrl: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: null,
    },
    private: {
      type: Boolean,
      required: true,
    },
    defaultBranch: {
      type: String,
      required: true,
    },
    tracked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

_connectedRepoSchema.index({ userId: 1, repoId: 1 }, { unique: true });

export const ConnectedRepoModel = model<IConnectedRepo>(
  "ConnectedRepo",
  _connectedRepoSchema,
);
