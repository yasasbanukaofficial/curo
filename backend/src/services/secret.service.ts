import { SecretsModel } from "../models/secrets.model";
import { ISecret } from "../types/secret";
import { encrypt } from "../util";

export const secretService = {
  saveSecretToDB: async (userId: string, data: ISecret): Promise<boolean> => {
    const { secName, secKey, projectId } = data;
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
    const { secName, secKey, projectId } = data;
    if (!secretId) {
      throw new Error("SECRET_ID_NOT_EXISTING");
    }

    if (!secName && !secKey && !projectId) {
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
};
