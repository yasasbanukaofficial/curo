import { ProjectModel } from "../models/project.model";
import { IProject } from "../types/project";

export const projectService = {
  getAllProjects: async (userId: string): Promise<IProject[]> => {
    try {
      const resp = await ProjectModel.find({ userId }).sort({
        createdAt: -1,
      });
      const allProjects: IProject[] = resp.map((projectDoc) => ({
        projectName: projectDoc.projectName,
        description: projectDoc.description,
        userId: projectDoc.userId,
      }));
      return allProjects;
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  createProject: async (userId: string, data: IProject): Promise<boolean> => {
    const { projectName, description } = data;
    if (!projectName || !description) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      await ProjectModel.create({
        projectName,
        description,
        userId,
      });
      return true;
    } catch (dbError: any) {
      console.error("DB Error:", dbError);
      if (dbError.code === 11000) {
        throw new Error("DUPLICATE_PROJECT");
      }
      throw new Error("DATABASE_ERROR");
    }
  },
  updateProject: async (
    userId: string,
    projectId: string,
    data: Partial<IProject>,
  ): Promise<boolean> => {
    const { projectName, description } = data;
    if (!projectId) {
      throw new Error("PROJECT_ID_NOT_EXISTING");
    }

    if (!projectName && !description) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const existing = await ProjectModel.findOneAndUpdate(
        { _id: projectId, userId },
        { $set: data },
        { new: true },
      );

      if (!existing) {
        throw new Error("PROJECT_NOT_FOUND");
      }

      return true;
    } catch (error: any) {
      console.error("DB Error:", error);
      throw error;
    }
  },
  deleteProject: async (
    userId: string,
    projectId: string,
  ): Promise<boolean> => {
    try {
      const deleted = await ProjectModel.findByIdAndDelete({
        _id: projectId,
        userId,
      });
      if (!deleted) throw new Error("PROJECT_NOT_FOUND");
      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
};
