import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", authMiddleware, updateUser);
router.get("/check-auth", authMiddleware, checkAuth);

export default router;
