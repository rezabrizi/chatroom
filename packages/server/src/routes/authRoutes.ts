import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/authController";
import profile from "../controllers/profileController";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware";
import chatHistory from "../controllers/chatControllers";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.get("/chat/history", chatHistory);
router.post("/logout", verifyTokenMiddleware, logout);
router.get("/profile", verifyTokenMiddleware, profile);

export default router;
