import type { LoginFormValues, RegisterFormValues } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(_values: LoginFormValues): Promise<void> {
  // TODO: Implement login API call
  // POST /auth/login with email, password
  // On success: store user state, redirect to /dashboard
  // On error: throw with error message
}

export async function registerUser(_values: RegisterFormValues): Promise<void> {
  // TODO: Implement register API call
  // POST /auth/register with name, email, password
  // On success: auto-login or redirect to /login
  // On error: throw with error message
}

export async function logoutUser(): Promise<void> {
  // TODO: Implement logout API call
  // POST /auth/logout
  // Clear user state, redirect to /
}

export async function getCurrentUser(): Promise<void> {
  // TODO: Implement get current user API call
  // GET /auth/me
  // Return user data for auth context initialization
}

export function loginWithGoogle(): void {
  window.location.href = `${API_URL}/auth/google`;
}

export function loginWithGithub(): void {
  window.location.href = `${API_URL}/auth/github`;
}
