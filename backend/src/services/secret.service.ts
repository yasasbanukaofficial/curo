import { SecretsModel } from "../models/secrets.model";
import { ISecret } from "../types/secret";
import { UserModel } from "../models";
import { encrypt } from "../util";

export const secretService = {
  saveSecretToDB: async (userId: string, data: ISecret): Promise<boolean> => {
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new Error("USER_NOT_FOUND");
    }

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
      });
      return true;
    } catch (dbError) {
      console.error("DB Error:", dbError);
      throw new Error("DATABASE_ERROR");
    }
  },
};
