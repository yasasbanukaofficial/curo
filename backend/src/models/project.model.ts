import { model, Schema } from "mongoose";
import { IProject } from "../types/project";

export const _projectSchema = new Schema<IProject>({
  projectName: {
    type: String,
    required: [true, "Project name is required"],
    minLength: [2, "Project name is too short"],
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  projectLink: {
    type: String,
    required: false,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "User ID is required"],
  },
  teams: {
    type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    default: [],
  },
});

export const ProjectModel = model<IProject>("Project", _projectSchema);
