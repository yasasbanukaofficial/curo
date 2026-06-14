import { UserModel } from "../models";
import { IUser } from "../types";
import { tokenGen } from "../util/token";
import {
  oauth2Client,
  getGithubAccessToken,
  getGithubUserData,
  getGithubEmail,
} from "../integrations";
import { GOOGLE_OAUTH_CLIENT_ID } from "../config/env";
import { hash } from "../util";

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

    await existingUser.updateOne({ $push: { refreshTokens: [refreshToken] } });

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

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        _id: googleId,
        name,
        email,
        provider: ["google"],
      });
    }

    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);
    const googleRefreshToken = await hash.gen(tokens.refresh_token || "");

    await user.updateOne({
      $push: { refreshTokens: [refreshToken, googleRefreshToken] },
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
  githubCallback: async (code: string) => {
    const token = await getGithubAccessToken(code);
    const resp = await getGithubUserData(token);

    if (!resp) {
      throw new Error("The github authentication seem to have failed!");
    }

    const { id, name } = resp.data;
    const email = await getGithubEmail(token);

    if (!email || typeof email !== "string") {
      throw new Error("Failed ro fetch user's mail address");
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        _id: id,
        name,
        email,
        provider: ["github"],
      });
    }

    const accessToken = tokenGen.genAccessToken(user);
    const refreshToken = tokenGen.genRefreshToken(user);
    const githubAccessToken = await hash.gen(token);

    await user.updateOne({
      $each: { refreshTokens: [refreshToken, githubAccessToken] },
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
};

export const isExistingUser = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({
    email,
  });
  return !!user;
};
