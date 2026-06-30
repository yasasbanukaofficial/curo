import client from './client.js';
import type { ApiResponse, Project } from '../types/index.js';

export async function getProjects(): Promise<Project[]> {
  const { data } = await client.get<ApiResponse<Project[]>>('/projects/all');
  return data.data;
}

export async function getProject(projectId: string): Promise<Project> {
  const { data } = await client.get<ApiResponse<Project>>(`/projects/get/${projectId}`);
  return data.data;
}
