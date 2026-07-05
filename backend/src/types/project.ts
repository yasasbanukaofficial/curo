import { Types } from "mongoose";

export interface IProject {
  _id: string;
  projectName: string;
  description: string;
  projectLink?: string;
  userId: Types.ObjectId;
  teamId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}
