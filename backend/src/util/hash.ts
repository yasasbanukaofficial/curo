import crypto from "crypto";
import bcrypt from "bcryptjs";

export const hash = {
  gen: (plain: string, saltRounds = 10) => bcrypt.hashSync(plain, saltRounds),

  compare: (plain: string, hash: string) => bcrypt.compareSync(plain, hash),
};

export const tokenHash = {
  gen: (token: string) => crypto.createHash("sha256").update(token).digest("hex"),
};
