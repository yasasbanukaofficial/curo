import { ProjectModel } from "../models/project.model";
import { TeamModel } from "../models/team.model";
import { SecretsModel } from "../models/secrets.model";
import { EnvironmentModel } from "../models/environment.model";
import { IProject } from "../types/project";
import { TeamMemberModel } from "../models";

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
        _id: projectDoc._id.toString(),
        projectName: projectDoc.projectName,
        description: projectDoc.description,
        projectLink: projectDoc.projectLink,
        userId: projectDoc.userId,
        teamId: projectDoc.teamId,
      };
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  getAllProjects: async (userId: string, teamIds: string[], teamId?: string): Promise<any[]> => {
    try {
      let filter: any;

      if (teamId) {
        const membership = await TeamMemberModel.findOne({ userId, teamId, status: "active" });
        if (!membership) return [];
        filter = { teamId };
      } else {
        filter = {
          $or: [
            { userId, teamId: null },
            { userId, teamId: { $exists: false } },
            { teamId: { $in: teamIds } },
          ],
        };
      }

      const resp = await ProjectModel.find(filter).sort({ createdAt: -1 });
      const allProjects = resp.map((projectDoc) => ({
        _id: projectDoc._id,
        projectName: projectDoc.projectName,
        description: projectDoc.description,
        projectLink: projectDoc.projectLink,
        userId: projectDoc.userId,
        teamId: projectDoc.teamId,
        createdAt: projectDoc.createdAt,
        updatedAt: projectDoc.updatedAt,
      }));

      const projectsWithCounts = await Promise.all(
        allProjects.map(async (project) => {
          const [secretCount, environmentCount] = await Promise.all([
            SecretsModel.countDocuments({ projectId: project._id }),
            EnvironmentModel.countDocuments({ projectId: project._id }),
          ]);
          return {
            ...project,
            secretCount,
            environmentCount,
          };
        }),
      );

      return projectsWithCounts;
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
  createProject: async (userId: string, data: IProject & { teamId?: string }): Promise<any> => {
    const { projectName, description, projectLink, teamId } = data;
    if (!projectName) {
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
        teamId: teamId || null,
      });

      if (teamId) {
        await TeamModel.findByIdAndUpdate(teamId, { $push: { projects: project._id } });
      }

      return project.toObject();
    } catch (dbError: any) {
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

      if (project.teamId) {
        await TeamModel.findByIdAndUpdate(project.teamId, { $pull: { projects: project._id } });
      }

      const deleted = await ProjectModel.findByIdAndDelete(project._id);
      if (!deleted) throw new Error("PROJECT_NOT_FOUND");
      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
  setProjectTeam: async (
    projectId: string,
    teamId: string,
  ): Promise<boolean> => {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) throw new Error("PROJECT_NOT_FOUND");

      if (project.teamId?.toString() === teamId) {
        throw new Error("TEAM_ALREADY_ASSIGNED");
      }

      const oldTeamId = project.teamId;

      await ProjectModel.findByIdAndUpdate(projectId, { $set: { teamId } });

      await TeamModel.findByIdAndUpdate(teamId, { $push: { projects: projectId } });

      if (oldTeamId) {
        await TeamModel.findByIdAndUpdate(oldTeamId, { $pull: { projects: projectId } });
      }

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
  unsetProjectTeam: async (
    projectId: string,
  ): Promise<boolean> => {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) throw new Error("PROJECT_NOT_FOUND");

      const oldTeamId = project.teamId;
      if (!oldTeamId) throw new Error("TEAM_NOT_ASSIGNED");

      await ProjectModel.findByIdAndUpdate(projectId, { $set: { teamId: null } });

      await TeamModel.findByIdAndUpdate(oldTeamId, { $pull: { projects: projectId } });

      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
};
