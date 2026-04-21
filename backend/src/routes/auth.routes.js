import express from "express";
import {
  loginWorker,
  loginAdmin,
  googleLogin
} from "../controllers/auth.Controller.js";

const router = express.Router();

// 👷 Worker login
router.post("/worker/login", loginWorker);

// 🧑‍💼 Admin login
router.post("/admin/login", loginAdmin);

// 👤 User (Google login)
router.post("/google-login", googleLogin);

export default router;