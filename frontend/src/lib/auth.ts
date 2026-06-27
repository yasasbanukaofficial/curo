const API_URL = import.meta.env.VITE_API_URL;

function oauthUrl(path: string): string {
  const inviteToken = sessionStorage.getItem("inviteToken");
  const url = `${API_URL}${path}`;
  if (inviteToken) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}inviteToken=${encodeURIComponent(inviteToken)}`;
  }
  return url;
}

export function loginWithGoogle(): void {
  window.location.href = oauthUrl("/auth/google");
}

export function loginWithGithub(): void {
  window.location.href = oauthUrl("/auth/github");
}
