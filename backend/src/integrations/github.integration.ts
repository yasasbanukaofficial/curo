import axios from "axios";
import {
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  FRONTEND_URL,
} from "../config/env";

export const getGithubAccessToken = async (code: string) => {
  const params = new URLSearchParams([
    ["client_id", GITHUB_OAUTH_CLIENT_ID || ""],
    ["client_secret", GITHUB_OAUTH_CLIENT_SECRET || ""],
    ["code", code || ""],
    ["redirect_uri", "http://localhost:5000/api/v1/auth/github/callback"],
  ]);

  const resp = await axios.get(
    `https://github.com/login/oauth/access_token?${params}`,
    {
      headers: { Accept: "application/json" },
    },
  );

  return resp.data.access_token;
};

export const getGithubUserData = async (accessToken: string) => {
  return await axios.get(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: "application/json",
    },
  });
};

export const getGithubEmail = async (accessToken: string) => {
  return await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });
};
