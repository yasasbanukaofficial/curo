import { ProjectModel } from "../models/project.model";
import { TeamModel } from "../models/team.model";
import { IProject } from "../types/project";

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const projectService = {
  getProjectById: async (
    projectId: string,
  ): Promise<IProject | null> => {
    try {
      const projectDoc = await ProjectModel.findById(projectId).lean();
      if (!projectDoc) return null;

      return {
        _id: projectDoc._id,
        projectName: projectDoc.projectName,
        description: projectDoc.description,
        projectLink: projectDoc.projectLink,
        userId: projectDoc.userId,
        teams: projectDoc.teams,
      };
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  getAllProjects: async (teamIds: string[]): Promise<IProject[]> => {
    try {
      const resp = await ProjectModel.find({ teams: { $in: teamIds } }).sort({
        createdAt: -1,
      });
      const allProjects = resp.map((projectDoc) => ({
        _id: projectDoc._id,
        projectName: projectDoc.projectName,
        description: projectDoc.description,
        projectLink: projectDoc.projectLink,
        userId: projectDoc.userId,
        teams: projectDoc.teams,
      }));
      return allProjects;
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  createProject: async (userId: string, data: IProject): Promise<any> => {
    const { projectName, description, projectLink } = data;
    if (!projectName || !description) {
      throw new Error("INVALID_PAYLOAD");
    }

    if (projectLink && !isValidUrl(projectLink)) {
      throw new Error("INVALID_PROJECT_LINK");
    }

    try {
      const project = await ProjectModel.create({
        projectName,
        description,
        projectLink: projectLink || undefined,
        userId,
      });

      return project.toObject();
    } catch (dbError: any) {
      if (dbError.code === 11000) {
        throw new Error("DUPLICATE_PROJECT");
      }
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },
  updateProject: async (
    projectId: string,
    data: Partial<IProject>,
  ): Promise<boolean> => {
    if (!projectId) {
      throw new Error("PROJECT_ID_NOT_EXISTING");
    }

    if (!data.projectName && !data.description && !data.projectLink) {
      throw new Error("INVALID_PAYLOAD");
    }

    if (data.projectLink && !isValidUrl(data.projectLink)) {
      throw new Error("INVALID_PROJECT_LINK");
    }

    try {
      const existing = await ProjectModel.findByIdAndUpdate(
        projectId,
        { $set: data },
        { returnDocument: "after" },
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
    projectId: string,
  ): Promise<boolean> => {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) throw new Error("PROJECT_NOT_FOUND");

      await TeamModel.updateMany(
        { _id: { $in: project.teams || [] } },
        { $pull: { projects: project._id } },
      );

      const deleted = await ProjectModel.findByIdAndDelete(project._id);
      if (!deleted) throw new Error("PROJECT_NOT_FOUND");
      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
  addTeamToProject: async (
    projectId: string,
    teamId: string,
  ): Promise<boolean> => {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) throw new Error("PROJECT_NOT_FOUND");

      if (project.teams?.some((id) => id.toString() === teamId)) {
        throw new Error("TEAM_ALREADY_ASSIGNED");
      }

      await ProjectModel.findByIdAndUpdate(projectId, {
        $push: { teams: teamId },
      });

      await TeamModel.findByIdAndUpdate(teamId, {
        $push: { projects: projectId },
      });

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
  removeTeamFromProject: async (
    projectId: string,
    teamId: string,
  ): Promise<boolean> => {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) throw new Error("PROJECT_NOT_FOUND");

      await ProjectModel.findByIdAndUpdate(projectId, {
        $pull: { teams: teamId },
      });

      await TeamModel.findByIdAndUpdate(teamId, {
        $pull: { projects: projectId },
      });

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
};
