import client from './client.js';
import type { ApiResponse, User } from '../types/index.js';

interface LoginData {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<LoginData> {
  const { data } = await client.post<ApiResponse<LoginData>>('/auth/login', { email, password });
  return data.data;
}

export async function getMe(): Promise<User> {
  const { data } = await client.get<ApiResponse<User>>('/auth/me');
  return data.data;
}

export async function logout(): Promise<void> {
  await client.post<ApiResponse<null>>('/auth/logout');
}
