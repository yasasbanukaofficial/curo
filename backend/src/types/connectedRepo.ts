import { Document } from "mongoose";

export type RepoStatus = "active" | "deleted";

export interface IConnectedRepo extends Document {
  userId: string;
  repoId: number;
  fullName: string;
  htmlUrl: string;
  language: string | null;
  private: boolean;
  defaultBranch: string;
  status: RepoStatus;
  tracked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
