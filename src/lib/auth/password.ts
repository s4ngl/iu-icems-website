import { randomBytes, scrypt, timingSafeEqual } from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const RESET_TOKEN_LENGTH = 32;
const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH).toString("hex");
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });

  const storedKey = Buffer.from(hash, "hex");
  return timingSafeEqual(derivedKey, storedKey);
}

export function generateResetToken(): { token: string; expiresAt: Date } {
  const token = randomBytes(RESET_TOKEN_LENGTH).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + RESET_TOKEN_EXPIRY_HOURS);
  return { token, expiresAt };
}

export function isTokenExpired(expiresAt: Date | string): boolean {
  const expiry = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return new Date() > expiry;
}
