import { Document, Types } from "mongoose";

export interface IRepo extends Document {
  userId: Types.ObjectId;
  repoName: string;
  topics: [string];
  is_active: boolean;
  has_issues: boolean;
}
