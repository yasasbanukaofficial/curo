const requiredVars = [
  "PORT",
  "MONGODB_URL",
  "API_VER",
  "FRONTEND_URL",
  "JWT_SECRET",
  "ENCRYPTION_KEY",
] as const;

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

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
  ENCRYPTION_KEY,
} = process.env;
