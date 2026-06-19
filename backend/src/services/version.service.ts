import { VersionModel } from "../models/version.model";
import { encrypt } from "../util";

export const versionService = {
  createVersion: async (
    userId: string,
    secretId: string,
    secKey: string,
  ): Promise<boolean> => {
    try {
      const latestVersion = await VersionModel.findOne({ secretId })
        .sort({ version: -1 })
        .select("version");

      const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

      await VersionModel.create({
        secretId,
        secKey,
        version: nextVersion,
        userId,
      });

      return true;
    } catch (error: any) {
      console.error("DB Error:", error);
      throw error;
    }
  },

  getAllVersions: async (
    userId: string,
    secretId: string,
  ): Promise<any[]> => {
    try {
      const versions = await VersionModel.find({ secretId, userId })
        .sort({ version: -1 });

      return versions.map((v) => ({
        _id: v._id,
        secretId: v.secretId,
        secKey: encrypt.decrypt(v.secKey) ?? "",
        version: v.version,
        createdAt: v.createdAt,
      }));
    } catch (error: any) {
      console.error("DB Error:", error);
      throw error;
    }
  },
};
