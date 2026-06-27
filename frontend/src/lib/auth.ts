const API_URL = import.meta.env.VITE_API_URL;

export function loginWithGoogle(): void {
  window.location.href = `${API_URL}/auth/google`;
}

export function loginWithGithub(): void {
  window.location.href = `${API_URL}/auth/github`;
}
