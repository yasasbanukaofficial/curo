export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  refreshTokens?: string[];
  googleId?: string;
  githubId?: string;
  googleRefreshToken?: string;
  githubAccessToken?: string;
  provider: string[];
  createdAt: string;
  updatedAt: string;
}
