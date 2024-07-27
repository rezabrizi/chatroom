import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.models";
import {
  generateRandomToken,
  verifyToken,
  BLOCKED_TOKENS,
} from "../utils/jwtUtils";
import bcrypt from "bcrypt";

// block a refresh token for when a user logs out
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

// every 24 hours remove any invalidated refersh tokens from the blacklist
setInterval(removeExpiredRefreshTokens, 86400000);

export const register = async (req: Request, res: Response) => {
  try {
    // get the body of the request
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Name, email, and password can't be null",
      });
    }
    // make sure the email doesn't exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ status: "error", message: "Duplicate Email" });
    }
    // create a hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // crate a user document
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

// login the user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    // authenticate the user
    if (user && (await bcrypt.compare(password, user.password))) {
      // await Session.deleteMany({ userId: user._id });

      // generate tokens
      const accessToken = generateRandomToken({ type: "access" }, user.name);
      const refreshToken = generateRandomToken({ type: "refresh" }, user.name);

      // await Session.create({ userId: user._id, token: refreshToken });
      // save the refresh token in an httponly cookie that can only be accessed by the server
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 604800000,
      });
      // send the access token as part of the response
      res.status(200).json({ status: "ok", accessToken });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// logout function
export const logout = async (req: Request, res: Response) => {
  try {
    // get the refreshtoken
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const decoded: any = verifyToken(refreshToken, { type: "refresh" });
      if (decoded) {
        const expiresIn = decoded.exp * 1000 - Date.now();
        // add the refresh token to a list of blacklisted tokens until it expires
        blockToken(refreshToken, expiresIn);
      }
    }
    // clear the cookie
    res.clearCookie("refreshToken");
    res.json({ status: "ok", message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

// verify the refresh token and get a new access token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ status: "error", message: "No refresh token" });
    }

    // make sure it is not in the blacklist
    if (BLOCKED_TOKENS.has(refreshToken)) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid refresh token" });
    }

    // verify the refresh token
    const decoded = verifyToken(refreshToken, { type: "refresh" });
    if (decoded === null) {
      return res
        .status(403)
        .json({ status: "error", message: "Invalid refresh token" });
    }

    // generate a new access token
    const newAccessToken = generateRandomToken(
      { type: "access" },
      decoded.name as string
    );
    // send the access token
    res.status(200).json({ status: "ok", accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
