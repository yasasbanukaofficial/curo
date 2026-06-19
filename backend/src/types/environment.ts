import { Types } from "mongoose";

export interface IEnvironment {
  name: string;
  projectId: Types.ObjectId;
  userId: Types.ObjectId;
}
