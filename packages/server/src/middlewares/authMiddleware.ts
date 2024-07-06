import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken || verifyToken(accessToken, { type: "access" }) === null) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  next();
};
