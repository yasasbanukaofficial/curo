import { Document } from "mongoose";

export interface IConnectedRepo extends Document {
  userId: string;
  repoId: number;
  fullName: string;
  htmlUrl: string;
  language: string | null;
  private: boolean;
  defaultBranch: string;
  tracked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
