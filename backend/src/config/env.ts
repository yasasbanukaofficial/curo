export const {
  PORT,
  MONGODB_URL,
  API_VER,
  FRONTEND_URL,
  NODE_ENV,
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  GITHUB_REDIRECT_URL,
  GITHUB_APP_PEM,
  GITHUB_APP_ID_VALUE,
} = process.env as {
  PORT: string | undefined;
  MONGODB_URL: string | undefined;
  API_VER: string | undefined;
  FRONTEND_URL: string | undefined;
  NODE_ENV: string | undefined;
  JWT_SECRET: string | undefined;
  JWT_ACCESS_EXPIRY: string | undefined;
  JWT_REFRESH_EXPIRY: string | undefined;
  GOOGLE_OAUTH_CLIENT_ID: string | undefined;
  GOOGLE_OAUTH_CLIENT_SECRET: string | undefined;
  GOOGLE_REDIRECT_URL: string | undefined;
  GITHUB_OAUTH_CLIENT_ID: string | undefined;
  GITHUB_OAUTH_CLIENT_SECRET: string | undefined;
  GITHUB_REDIRECT_URL: string | undefined;
  GITHUB_APP_PEM: string | undefined;
  GITHUB_APP_ID_VALUE: string | undefined;
};
