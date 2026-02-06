import { randomBytes, createHmac } from "crypto";

const TOKEN_LENGTH = 32;
const OTP_LENGTH = 6;

export function generateToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex");
}

export function verifyToken(
  token: string,
  storedToken: string,
  expiresAt: Date | string
): boolean {
  if (!token || !storedToken) return false;

  const expiry = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  if (new Date() > expiry) return false;

  const secret = process.env.TOKEN_SECRET || "default-secret";
  const expectedHash = createHmac("sha256", secret).update(storedToken).digest("hex");
  const providedHash = createHmac("sha256", secret).update(token).digest("hex");

  return expectedHash === providedHash;
}

export function generateOTP(): { otp: string; expiresAt: Date } {
  const digits = "0123456789";
  const bytes = randomBytes(OTP_LENGTH);
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[bytes[i] % 10];
  }

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  return { otp, expiresAt };
}
