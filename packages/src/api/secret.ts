import client from './client.js';
import type { ApiResponse, Secret } from '../types/index.js';

export async function getSecrets(projectId: string): Promise<Secret[]> {
  const { data } = await client.get<ApiResponse<Secret[]>>(`/projects/${projectId}/secrets`);
  return data.data;
}
