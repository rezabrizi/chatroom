/**
 * This is the router file that create all the HTTP endpoints and
 * specifies if they are private routes or not
 * ie you need to be authenticated with your jwt token
 */

// Import express router
import { Router } from "express";
// import all the logic from our controllers
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/authController";
import profile from "../controllers/profileController";
import chatHistory from "../controllers/chatControllers";
// import the authentication middleware
import { verifyTokenMiddleware } from "../middlewares/authMiddleware";

// create an instance of the express router
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.get("/chat/history", chatHistory);
router.post("/logout", verifyTokenMiddleware, logout);
router.get("/profile", verifyTokenMiddleware, profile);

export default router;
