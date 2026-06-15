import { UserModel } from "../models";
import { IUser } from "../types";

export const userService = {
  fetchUserDetails: async (userId: string) => {
    const user = await UserModel.findById(userId);
    return !user ? null : user;
  },
};
