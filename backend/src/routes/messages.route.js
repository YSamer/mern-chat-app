import express from "express";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/users", authMiddleware, getUsersForSidebar);
router.get("/:userId", authMiddleware, getMessages);
router.post("/send/:userId", authMiddleware, sendMessage);

export default router;
