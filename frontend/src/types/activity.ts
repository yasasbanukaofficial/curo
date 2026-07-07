export interface ActivityLogEntry {
  _id: string;
  action: string;
  entityType: "project" | "secret" | "environment" | "team" | "member" | "auth";
  entityId: string;
  entityName: string;
  description: string;
  metadata?: Record<string, any>;
  userId: string;
  userName: string;
  userAvatar?: string;
  projectId?: string;
  projectName?: string;
  environmentId?: string;
  environmentName?: string;
  teamId?: string;
  teamName?: string;
  createdAt: string;
}

export interface ActivityLogFilters {
  dateRange?: { start: string; end: string };
  entityType?: string;
  projectId?: string;
  teamId?: string;
  userId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ActivityLogResponse {
  entries: ActivityLogEntry[];
  total: number;
  page: number;
  totalPages: number;
}
