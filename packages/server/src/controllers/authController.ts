import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.models";
import {
  generateRandomToken,
  verifyToken,
  BLOCKED_TOKENS,
} from "../utils/jwtUtils";
import bcrypt from "bcrypt";

const blockToken = (token: string, expiresIn: number) => {
  const expirationTime = Date.now() + expiresIn * 1000;
  BLOCKED_TOKENS.set(token, expirationTime);
};

const removeExpiredRefreshTokens = () => {
  const now = Date.now();
  BLOCKED_TOKENS.forEach((expiresIn, token) => {
    if (expiresIn <= now) {
      BLOCKED_TOKENS.delete(token);
    }
  });
};

setInterval(removeExpiredRefreshTokens, 86400000);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and password can't be null",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ status: "error", message: "Duplicate Email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while registering user.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // await Session.deleteMany({ userId: user._id });

      const accessToken = generateRandomToken({ type: "access" }, user.name);
      const refreshToken = generateRandomToken({ type: "refresh" }, user.name);

      // await Session.create({ userId: user._id, token: refreshToken });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 604800000,
      });

      res.status(200).json({ status: "ok", accessToken });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const decoded: any = verifyToken(refreshToken, { type: "refresh" });
      if (decoded) {
        const expiresIn = decoded.exp * 1000 - Date.now();
        blockToken(refreshToken, expiresIn);
      }
    }
    res.clearCookie("refreshToken");
    res.json({ status: "ok", message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: "error", message: "No refresh token" });
    }

    if (BLOCKED_TOKENS.has(refreshToken)) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid refresh token" });
    }

    const decoded = verifyToken(refreshToken, { type: "refresh" });
    if (decoded === null) {
      return res
        .status(403)
        .json({ status: "error", message: "Invalid refresh token" });
    }

    const newAccessToken = generateRandomToken(
      { type: "access" },
      decoded.name as string
    );
    res.status(200).json({ status: "ok", accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
