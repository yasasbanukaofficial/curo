import { EnvironmentModel } from "../models/environment.model";
import { SecretsModel } from "../models/secrets.model";
import { IEnvironment } from "../types/environment";

export const environmentService = {
  getEnvironmentById: async (
    userId: string,
    environmentId: string,
  ): Promise<IEnvironment | null> => {
    try {
      const envDoc = await EnvironmentModel.findOne({
        _id: environmentId,
        userId,
      });
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
      const resp = await EnvironmentModel.find({ userId }).sort({
        createdAt: -1,
      });
      const allEnvs = resp.map((envDoc) => ({
        _id: envDoc._id,
        name: envDoc.name,
        projectId: envDoc.projectId,
        userId: envDoc.userId,
      }));
      return allEnvs;
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
    if (!name || !projectId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      await EnvironmentModel.create({
        name,
        projectId,
        userId,
      });

      return true;
    } catch (dbError: any) {
      if (dbError.code === 11000) {
        throw new Error("DUPLICATE_ENVIRONMENT");
      }
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },

  updateEnvironment: async (
    userId: string,
    environmentId: string,
    data: Partial<IEnvironment>,
  ): Promise<boolean> => {
    const { name, projectId } = data;
    if (!environmentId) {
      throw new Error("ENVIRONMENT_ID_NOT_EXISTING");
    }

    if (!name && !projectId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const existing = await EnvironmentModel.findOneAndUpdate(
        { _id: environmentId, userId },
        { $set: data },
        { returnDocument: "after" },
      );

      if (!existing) {
        throw new Error("ENVIRONMENT_NOT_FOUND");
      }

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
      await SecretsModel.deleteMany({ environmentId, userId });
      const deleted = await EnvironmentModel.findOneAndDelete({
        _id: environmentId,
        userId,
      });
      if (!deleted) throw new Error("ENVIRONMENT_NOT_FOUND");
      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
};
