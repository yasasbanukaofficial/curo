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
  createdAt: string;
  updatedAt: string;
}
