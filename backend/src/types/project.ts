import { Types } from "mongoose";

export interface IProject {
  projectName: string;
  description: string;
  userId: Types.ObjectId;
}
