export interface ProjectOption {
  id: string;
  name: string;
}

export interface Project {
  _id: string;
  projectName: string;
  description: string;
  projectLink?: string;
  userId: string;
  secretCount: number;
  environmentCount: number;
  teamCount: number;
  memberCount: number;
  teams: string[];
  createdAt: string;
  updatedAt: string;
}
