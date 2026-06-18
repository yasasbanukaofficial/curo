import { Types } from "mongoose";

export interface ISecret {
  secName: string;
  secKey: string;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
}
