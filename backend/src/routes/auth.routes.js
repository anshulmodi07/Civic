import express from "express";
import {
  getMe,
  loginAdmin,
  loginUser,
  loginWorker,
  registerUser,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/worker/login", loginWorker);
router.post("/admin/login", loginAdmin);
router.get("/me", authMiddleware, getMe);

export default router;
