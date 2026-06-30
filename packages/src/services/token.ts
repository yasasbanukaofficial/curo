import Conf from 'conf';

const store = new Conf({ projectName: 'curo' });

const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'user_email';
const WORKSPACE_KEY = 'workspace';

export function getToken(): string | null {
  return store.get(TOKEN_KEY) as string | null;
}

export function setToken(token: string): void {
  store.set(TOKEN_KEY, token);
}

export function clearToken(): void {
  store.delete(TOKEN_KEY);
}

export function getUserEmail(): string | null {
  return store.get(EMAIL_KEY) as string | null;
}

export function setUserEmail(email: string): void {
  store.set(EMAIL_KEY, email);
}

export function clearUserEmail(): void {
  store.delete(EMAIL_KEY);
}

export function getWorkspace(): string | null {
  return store.get(WORKSPACE_KEY) as string | null;
}

export function setWorkspace(workspace: string): void {
  store.set(WORKSPACE_KEY, workspace);
}

export function clearWorkspace(): void {
  store.delete(WORKSPACE_KEY);
}

export function clearAll(): void {
  store.clear();
}
