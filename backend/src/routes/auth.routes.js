import express from "express";
import {
  loginWorker,
  loginAdmin,
  googleLogin,
  loginUser
} from "../controllers/auth.controller.js";

const router = express.Router();

// 👷 Worker login
router.post("/worker/login", loginWorker);

// 🧑‍💼 Admin login
router.post("/admin/login", loginAdmin);

// 👤 User (Google login)
router.post("/google-login", googleLogin);

// 👤 User (Email login)
router.post("/user/login", loginUser);

export default router;