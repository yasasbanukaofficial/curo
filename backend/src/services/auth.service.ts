import bcrypt from "bcryptjs";
import { UserModel } from "../models";
import { IUser } from "../types";
import { tokenGen } from "../util/token";

export const authService = {
  register: async (user: IUser) => {
    const { name, email, password } = user;

    const existingUser = await UserModel.findOne({
      email,
    });

    if (existingUser) {
      return {
        success: false,
        status: 409,
        msg: "User already exists",
      };
    }

    const hashedPass = bcrypt.hashSync(password, 10);
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
    const passwordMatches = bcrypt.compareSync(password, existingUser.password);
    if (!passwordMatches) {
      return {
        success: false,
        status: 401,
        msg: "Invalid credentials, please try again!",
      };
    }

    const accessToken = tokenGen.genAccessToken(existingUser);
    const refreshToken = tokenGen.genRefreshToken(existingUser);

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
};
