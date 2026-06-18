import { UserModel } from "../models";
import { IUser } from "../types";
import { tokenGen, verifyToken } from "../util/token";
import {
  oauth2Client,
  getGithubAccessToken,
  getGithubUserData,
  getGithubEmail,
} from "../integrations";
import { GOOGLE_OAUTH_CLIENT_ID } from "../config/env";
import { hash, encrypt } from "../util";

export const authService = {
  register: async (user: IUser) => {
    const { name, email, password } = user;

    const existingUser = await isExistingUser(email);

    if (existingUser) {
      return {
        success: false,
        status: 409,
        msg: "User already exists",
      };
    }

    const hashedPass = await hash.gen(password);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPass,
    });

    return {
      success: true,
      status: 201,
      msg: "Successfully created an user",
      data: { id: newUser._id, name, email },
    };
  },
  login: async ({ email, password }: { email: string; password: string }) => {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return {
        success: false,
        status: 404,
        msg: "User not found",
      };
    }
    const passwordMatches = await hash.compare(password, existingUser.password);
    if (!passwordMatches) {
      return {
        success: false,
        status: 401,
        msg: "Invalid credentials, please try again!",
      };
    }

    const accessToken = tokenGen.genAccessToken(existingUser);
    const refreshToken = tokenGen.genRefreshToken(existingUser);

    await existingUser.updateOne({ $push: { refreshTokens: refreshToken } });

    return {
      success: true,
      status: 200,
      msg: "Login successful",
      data: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  },

  googleCallback: async (code: string) => {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token as string,
      audience: GOOGLE_OAUTH_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid Google token payload");
    }

    const { sub: googleId, name, email } = payload;

    let user = await UserModel.findOne({
      $or: [{ email }, { googleId }],
    });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        googleId,
        provider: ["google"],
      });
    } else if (!user.googleId) {
      await user.updateOne({
        $set: { googleId },
        $addToSet: { provider: "google" },
      });
      user.googleId = googleId;
      user.provider.push("google");
    }

    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);

    const update: Record<string, any> = {
      $push: { refreshTokens: refreshToken },
    };

    if (tokens.refresh_token) {
      update.$set = { googleRefreshToken: encrypt.gen(tokens.refresh_token) };
    }

    await user.updateOne(update);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  githubCallback: async (code: string) => {
    const githubToken = await getGithubAccessToken(code);
    const githubUser = await getGithubUserData(githubToken);

    if (!githubUser) {
      throw new Error("The github authentication seem to have failed!");
    }

    const { id: githubId, name } = githubUser.data;
    const email = await getGithubEmail(githubToken);

    if (!email) {
      throw new Error("No verified primary email found on GitHub");
    }

    let user = await UserModel.findOne({
      $or: [{ email }, { githubId }],
    });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        githubId,
        provider: ["github"],
      });
    } else if (!user.githubId) {
      await user.updateOne({
        $set: { githubId },
        $addToSet: { provider: "github" },
      });
      user.githubId = githubId;
      user.provider.push("github");
    }

    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);

    await user.updateOne({
      $push: { refreshTokens: refreshToken },
      $set: {
        githubAccessToken: encrypt.gen(githubToken),
      },
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  refresh: async (refreshToken: string) => {
    const decoded = verifyToken(refreshToken);

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return { success: false, status: 404, msg: "User not found" };
    }

    const tokenExists = user.refreshTokens.includes(refreshToken);
    if (!tokenExists) {
      return { success: false, status: 401, msg: "Invalid refresh token" };
    }

    const newAccessToken = tokenGen.genAccessToken(user);
    const newRefreshToken = tokenGen.genRefreshToken(user);

    await UserModel.findByIdAndUpdate(user._id, {
      $pull: { refreshTokens: refreshToken },
      $push: { refreshTokens: newRefreshToken },
    });

    return {
      success: true,
      status: 200,
      msg: "Tokens refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userId: user._id.toString(),
        userEmail: user.email,
      },
    };
  },

  me: async (userId: string) => {
    const user = await UserModel.findById(userId).select("-password -refreshTokens -googleRefreshToken -githubAccessToken");
    if (!user) {
      return { success: false, status: 404, msg: "User not found" };
    }
    return {
      success: true,
      status: 200,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        createdAt: user.createdAt,
      },
    };
  },
};

export const isExistingUser = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({
    email,
  });
  return !!user;
};
