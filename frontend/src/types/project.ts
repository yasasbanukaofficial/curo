export interface ProjectOption {
  id: string;
  name: string;
}

export interface Project {
  _id: string;
  projectName: string;
  description?: string;
  projectLink?: string;
  userId: string;
  role?: string;
  secretCount: number;
  environmentCount: number;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
}
