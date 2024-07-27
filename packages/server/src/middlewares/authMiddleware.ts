import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

// this middleware authenticates every protected http request
export const verifyTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // remember the access token was provided as part of the header
  // like `Bearer accessToken`
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken || verifyToken(accessToken, { type: "access" }) === null) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  // proceed to our next handler in the request
  next();
};
