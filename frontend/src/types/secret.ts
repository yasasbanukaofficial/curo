export interface Secret {
  _id: string;
  secName: string;
  secKey: string;
  projectId: string;
  userId: string;
  environmentId?: string;
  author: string;
  updatedAt: string;
}
