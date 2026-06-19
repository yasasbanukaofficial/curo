import { Types } from "mongoose";

export interface IVersion {
  secretId: Types.ObjectId;
  secKey: string;
  version: number;
  userId: Types.ObjectId;
}
