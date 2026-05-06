import express from "express";
import {
  registerUser,
  loginUser,
  loginWorker,
  loginAdmin,
  getMe,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/worker/login", loginWorker);
router.post("/admin/login", loginAdmin);
router.get("/me", protect, getMe);

export default router;
