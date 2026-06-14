import crypto from "crypto";
import { ENCRYPTION_KEY } from "../config/env";

const ALGORITHM = "aes-256-cbc";
const KEY = crypto.scryptSync(ENCRYPTION_KEY ?? "fallback-key", "salt", 32);
const IV_LENGTH = 16;

export const encrypt = {
  gen: (plain: string): string => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  },

  compare: (plain: string, encrypted: string): string | null => {
    try {
      const [ivHex, encryptedHex] = encrypted.split(":");
      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
      const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, "hex")),
        decipher.final(),
      ]);
      return decrypted.toString("utf8");
    } catch {
      return null;
    }
  },
};
