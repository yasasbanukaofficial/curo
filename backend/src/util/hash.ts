import bcrypt from "bcryptjs";

export const hash = {
  gen: (plain: string, saltRounds = 10) => bcrypt.hashSync(plain, saltRounds),

  compare: (plain: string, hash: string) => bcrypt.compareSync(plain, hash),
};
