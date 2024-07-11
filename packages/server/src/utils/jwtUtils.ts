import jwt, { JwtPayload } from "jsonwebtoken";
import { refreshToken } from "../controllers/authController";

export const ACCESS_SECRET = "THIS IS A TEST";
export const REFRESH_TOKEN = "This is a nother test";
export const BLOCKED_TOKENS = new Map<string, number>();

interface TokenType {
  type: "refresh" | "access";
}

export const generateRandomToken = (type: TokenType, name: string): string => {
  const payload = { name };
  console.log(payload);
  if (type.type === "access")
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1m" });
  else return jwt.sign(payload, REFRESH_TOKEN, { expiresIn: "7d" });
};

export const verifyToken = (
  token: string,
  type: TokenType
): JwtPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      type.type === "access" ? ACCESS_SECRET : REFRESH_TOKEN
    );

    if (type.type === "refresh" && BLOCKED_TOKENS.has(token)) return null;
    return decoded as JwtPayload;
  } catch (err) {
    return null;
  }
};
