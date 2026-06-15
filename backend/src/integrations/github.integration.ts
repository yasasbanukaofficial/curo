import axios from "axios";
import {
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  FRONTEND_URL,
} from "../config/env";
import { Octokit } from "octokit";
import { githubResponseConverter } from "../util/normalizer";
import { RawRepo } from "../types";

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
  const { data } = await axios.get("https://api.github.com/user/emails", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  });

  const primary = data.find(
    (e: any) => e.primary === true && e.verified === true,
  );

  return primary?.email ?? null;
};

export const getGithubRepos = async (accessToken: string, userId: string) => {
  const octokit = new Octokit({
    auth: accessToken,
  });

  const resp = await octokit.request("GET /user/repos", {
    headers: {
      "X-GitHub-Api-Version": "2026-03-10",
    },
    visibility: "public",
    sort: "pushed",
    direction: "desc",
  });

  if (!resp || resp.status !== 200) {
    throw new Error("Error when fetching github repositories");
  }

  const thirtyDays = Date.now() - 30 * 24 * 60 * 60 * 1000;

  const activeRepo = (resp.data as RawRepo[]).filter(
    (repo) =>
      repo.pushed_at !== null &&
      new Date(repo.pushed_at).getTime() > thirtyDays,
  );

  return githubResponseConverter(activeRepo as RawRepo[], userId);
};
