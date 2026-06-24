import { Types } from "mongoose";

export interface IProject {
  projectName: string;
  description: string;
  projectLink?: string;
  userId: Types.ObjectId;
}
