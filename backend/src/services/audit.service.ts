import { AuditModel } from "../models/audit.model";
import { IAudit } from "../types/audit";

export const auditService = {
  createAudit: async (data: IAudit): Promise<void> => {
    try {
      await AuditModel.create(data);
    } catch (error) {
      console.error("Audit log error:", error);
    }
  },

  getAllAudits: async (userId: string): Promise<any[]> => {
    try {
      const auditLogs = await AuditModel.find({ userId }).sort({
        createdAt: -1,
      });

      return auditLogs.map((log) => ({
        _id: log._id,
        userId: log.userId,
        action: log.action,
        resource: log.resource,
        metadata: log.metadata,
        createdAt: log.createdAt,
      }));
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
};
