import { AuditModel } from "../models/audit.model";
import { IAudit } from "../types/audit";
import { UserModel } from "../models/user.model";
import { EnvironmentModel } from "../models/environment.model";

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

      const envIds = [...new Set(auditLogs.map((l) => l.metadata?.environmentId).filter(Boolean))];
      const environments = await EnvironmentModel.find({ _id: { $in: envIds } }).lean();
      const envMap = new Map(environments.map((e) => [e._id.toString(), e.name]));

      const user = await UserModel.findById(userId).lean();
      const userName = user?.displayName || user?.email || "";
      const userRole = user?.role || "";

      return auditLogs.map((log) => {
        const meta = log.metadata || {};
        return {
          _id: log._id,
          userId: log.userId,
          action: log.action,
          resource: log.resource,
          target: meta.secName || meta.secretId || "",
          env: envMap.get(meta.environmentId) || "",
          role: userRole,
          user: userName,
          time: log.createdAt
            ? new Date(log.createdAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          createdAt: log.createdAt,
          metadata: meta,
        };
      });
    } catch (error) {
      console.error("DB Error:", error);
      throw new Error("DATABASE_ERROR");
    }
  },
};
