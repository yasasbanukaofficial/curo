import { EnvironmentModel } from "../models/environment.model";
import { IEnvironment } from "../types/environment";

export const environmentService = {
  getEnvironmentById: async (
    userId: string,
    environmentId: string,
  ): Promise<IEnvironment | null> => {
    try {
      const envDoc = await EnvironmentModel.findOne({ _id: environmentId, userId });
      if (!envDoc) return null;
      return {
        name: envDoc.name,
        projectId: envDoc.projectId,
        userId: envDoc.userId,
      };
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  getAllEnvironments: async (userId: string): Promise<IEnvironment[]> => {
    try {
      const resp = await EnvironmentModel.find({ userId }).sort({ createdAt: -1 });
      return resp.map((envDoc) => ({
        _id: envDoc._id,
        name: envDoc.name,
        projectId: envDoc.projectId,
        userId: envDoc.userId,
      }));
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  createEnvironment: async (
    userId: string,
    data: IEnvironment,
  ): Promise<boolean> => {
    const { name, projectId } = data;
    if (!name || !projectId) throw new Error("INVALID_PAYLOAD");

    try {
      await EnvironmentModel.create({ name, projectId, userId });
      return true;
    } catch (dbError: any) {
      if (dbError.code === 11000) throw new Error("DUPLICATE_ENVIRONMENT");
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },

  updateEnvironment: async (
    userId: string,
    environmentId: string,
    data: Partial<IEnvironment>,
  ): Promise<boolean> => {
    if (!environmentId) throw new Error("ENVIRONMENT_ID_NOT_EXISTING");
    if (!data.name && !data.projectId) throw new Error("INVALID_PAYLOAD");

    try {
      const existing = await EnvironmentModel.findOneAndUpdate(
        { _id: environmentId, userId },
        { $set: data },
        { returnDocument: "after" },
      );
      if (!existing) throw new Error("ENVIRONMENT_NOT_FOUND");
      return true;
    } catch (error: any) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  deleteEnvironment: async (
    userId: string,
    environmentId: string,
  ): Promise<boolean> => {
    try {
      const deleted = await EnvironmentModel.findOneAndDelete({ _id: environmentId, userId });
      if (!deleted) throw new Error("ENVIRONMENT_NOT_FOUND");
      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  getProjectEnvironments: async (projectId: string): Promise<IEnvironment[]> => {
    try {
      const resp = await EnvironmentModel.find({ projectId }).sort({ createdAt: -1 });
      return resp.map((envDoc) => ({
        _id: envDoc._id,
        name: envDoc.name,
        projectId: envDoc.projectId,
        userId: envDoc.userId,
      }));
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  createProjectEnvironment: async (
    userId: string, projectId: string, data: IEnvironment,
  ): Promise<boolean> => {
    const { name } = data;
    if (!name) throw new Error("INVALID_PAYLOAD");

    try {
      await EnvironmentModel.create({ name, projectId, userId });
      return true;
    } catch (dbError: any) {
      if (dbError.code === 11000) throw new Error("DUPLICATE_ENVIRONMENT");
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },

  updateProjectEnvironment: async (
    projectId: string, environmentId: string, data: Partial<IEnvironment>,
  ): Promise<boolean> => {
    if (!environmentId) throw new Error("ENVIRONMENT_ID_NOT_EXISTING");
    if (!data.name) throw new Error("INVALID_PAYLOAD");

    try {
      const existing = await EnvironmentModel.findOneAndUpdate(
        { _id: environmentId, projectId },
        { $set: { name: data.name } },
        { returnDocument: "after" },
      );
      if (!existing) throw new Error("ENVIRONMENT_NOT_FOUND");
      return true;
    } catch (error: any) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  deleteProjectEnvironment: async (
    projectId: string, environmentId: string, userId: string, role: string,
  ): Promise<boolean> => {
    try {
      const env = await EnvironmentModel.findOne({ _id: environmentId, projectId });
      if (!env) throw new Error("ENVIRONMENT_NOT_FOUND");
      if (role === "developer" && env.userId.toString() !== userId) {
        throw new Error("FORBIDDEN");
      }
      await EnvironmentModel.findOneAndDelete({ _id: environmentId, projectId });
      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
};
