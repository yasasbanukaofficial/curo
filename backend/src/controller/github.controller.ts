import { Response } from "express";
import { getGithubRepos } from "../integrations";
import { AuthRequest } from "../types/auth";
import { userService } from "../services";

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

    const accessToken = userDetails.githubId;
    if (!accessToken) {
      throw new Error("GitHub access token not found!");
    }

    return await getGithubRepos(accessToken, userId);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch GitHub repositories.";
    return res.status(500).json({ message });
  }
};
