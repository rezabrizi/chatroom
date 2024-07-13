import { Request, Response } from "express";
import User from "../models/user.models";

async function profile(req: Request, res: Response) {
  try {
    const { email } = req.query;
    console.log(`Profile controller ${email}`);
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email not provided",
      });
    }

    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (!existingUser) {
      return res.status(403).json({
        status: "error",
        message: "Email not found",
      });
    }

    res.status(201).json({ status: "ok", name: existingUser.name });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}

export default profile;
