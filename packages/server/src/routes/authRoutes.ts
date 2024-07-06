import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/authController";
import { verifyTokenMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.post("/logout", verifyTokenMiddleware, logout);

export default router;
