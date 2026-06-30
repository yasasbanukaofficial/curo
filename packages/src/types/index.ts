export type Route =
  | 'splash'
  | 'login'
  | 'dashboard'
  | 'projects'
  | 'project'
  | 'pull'
  | 'settings'
  | 'logout';

export interface User {
  _id: string;
  email: string;
  name?: string;
}

export interface Project {
  _id: string;
  projectName: string;
  description?: string;
  secretCount?: number;
  environmentCount?: number;
}

export interface Secret {
  _id: string;
  secName: string;
  secKey: string;
  projectId: string;
  environmentId?: string;
}

export interface Environment {
  _id: string;
  name: string;
  projectId: string;
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  msg: string;
  data: T;
}
