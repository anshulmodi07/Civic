import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

import {
  getMyProfile,
  getWorkerStats,
  getAttendance,
  getTodayShift,
  updateMyProfile   // ✅ ADD THIS
} from "../controllers/worker.controller.js";

const router = express.Router();

// 🔐 All routes protected
router.get("/me", authMiddleware, roleMiddleware("worker"), getMyProfile);

router.patch(
  "/me",
  authMiddleware,
  roleMiddleware("worker"),
  updateMyProfile
);


router.get("/stats", authMiddleware, roleMiddleware("worker"), getWorkerStats);

router.get("/attendance", authMiddleware, roleMiddleware("worker"), getAttendance);

router.get("/today-shift", authMiddleware, roleMiddleware("worker"), getTodayShift);

export default router;