import { SecretsModel } from "../models/secrets.model";
import { ISecret } from "../types/secret";
import { encrypt } from "../util";

export const secretService = {
  saveSecretToDB: async (userId: string, data: ISecret): Promise<boolean> => {
    const { secName, secKey, projectId, environmentId } = data;
    if (!secName || !secKey || !projectId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      const encryptedPass = encrypt.gen(secKey);
      await SecretsModel.create({
        secName,
        secKey: encryptedPass,
        projectId,
        userId,
        environmentId,
      });

      return true;
    } catch (dbError: any) {
      console.error("DB Error:", dbError);
      if (dbError.code === 11000) {
        throw new Error("DUPLICATE_SECRET");
      }
      throw new Error("DATABASE_ERROR");
    }
  },
  updateSecretInDB: async (
    userId: string,
    secretId: string,
    data: Partial<ISecret>,
  ): Promise<boolean> => {
    const { secName, secKey, projectId, environmentId } = data;
    if (!secretId) {
      throw new Error("SECRET_ID_NOT_EXISTING");
    }

    if (!secName && !secKey && !projectId && !environmentId) {
      throw new Error("INVALID_PAYLOAD");
    }

    try {
      if (secKey) {
        data.secKey = encrypt.gen(secKey);
      }

      const existingKey = await SecretsModel.findOneAndUpdate(
        { _id: secretId, userId },
        { $set: { data } },
        { new: true },
      );

      if (!existingKey) {
        throw new Error("SECRET_NOT_FOUND");
      }

      return true;
    } catch (error: any) {
      console.error("DB Error:", error);
      throw error;
    }
  },
  deleteSecretInDB: async (
    userId: string,
    secretId: string,
  ): Promise<boolean> => {
    try {
      const deleted = await SecretsModel.findByIdAndDelete({
        _id: secretId,
        userId,
      });
      if (!deleted) throw new Error("SECRET_NOT_FOUND");
      return true;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  },
  getSecretById: async (userId: string, secretId: string): Promise<ISecret | null> => {
    try {
      const secretDoc = await SecretsModel.findOne({ _id: secretId, userId });
      if (!secretDoc) return null;

      return {
        secName: secretDoc.secName,
        secKey: encrypt.decrypt(secretDoc.secKey) ?? "",
        projectId: secretDoc.projectId,
        userId: secretDoc.userId,
        environmentId: secretDoc.environmentId,
      };
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },

  getAllSecrets: async (userId: string): Promise<ISecret[]> => {
    try {
      const resp = await SecretsModel.find({ userId }).sort({
        createdAt: -1,
      });
      const allSecrets = resp.map((secretDoc) => ({
        _id: secretDoc._id,
        secName: secretDoc.secName,
        secKey: encrypt.decrypt(secretDoc.secKey) ?? "",
        projectId: secretDoc.projectId,
        userId: secretDoc.userId,
        environmentId: secretDoc.environmentId,
      }));
      return allSecrets;
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
};
