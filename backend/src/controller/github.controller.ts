import { Response } from "express";
import { getGithubRepos } from "../integrations";
import { AuthRequest } from "../types/auth";
import { userService } from "../services";
import { encrypt, sendResponse } from "../util";

export const fetchGithubRepos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("No user available!");
    }

    const userDetails = await userService.fetchUserDetails(userId);
    if (!userDetails) {
      throw new Error("User not found!");
    }

    const accessToken = userDetails.githubAccessToken;
    if (!accessToken) {
      throw new Error("GitHub access token not found!");
    }

    const decrypted = encrypt.compare(accessToken);
    if (!decrypted) throw new Error("Decryption failed | Github Access Token");

    const repos = await getGithubRepos(decrypted, userId);
    return sendResponse(res, {
      success: true,
      status: 200,
      data: repos,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch GitHub repositories.";
    return res.status(500).json({ message });
  }
};
