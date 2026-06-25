import type { LoginFormValues, RegisterFormValues } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(_values: LoginFormValues): Promise<void> {
}

export async function registerUser(_values: RegisterFormValues): Promise<void> {
}

export async function logoutUser(): Promise<void> {
}

export async function getCurrentUser(): Promise<void> {
}

export function loginWithGoogle(): void {
  window.location.href = `${API_URL}/auth/google`;
}

export function loginWithGithub(): void {
  window.location.href = `${API_URL}/auth/github`;
}
