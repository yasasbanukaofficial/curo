export const {
  PORT,
  MONGODB_URL,
  API_VER,
  FRONTEND_URL,
  NODE_ENV,
  JWT_SECRET,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} = process.env as {
  PORT: string | undefined;
  MONGODB_URL: string | undefined;
  API_VER: string | undefined;
  FRONTEND_URL: string | undefined;
  NODE_ENV: string | undefined;
  JWT_SECRET: string | undefined;
  GOOGLE_OAUTH_CLIENT_ID: string | undefined;
  GOOGLE_OAUTH_CLIENT_SECRET: string | undefined;
  GOOGLE_REDIRECT_URL: string | undefined;
};
