import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import {
  getWorkers,
  getSchedule,
  saveSchedule,
  getDashboardStats,
  getDashboardComplaints
} from "../controllers/admin.controller.js";

const router = express.Router();

// 🔐 All routes protected and require admin role
router.get("/workers", authMiddleware, roleMiddleware("admin"), getWorkers);

router.get("/shifts", authMiddleware, roleMiddleware("admin"), getSchedule);
router.post("/shifts", authMiddleware, roleMiddleware("admin"), saveSchedule);

router.get("/dashboard/stats", authMiddleware, roleMiddleware("admin"), getDashboardStats);
router.get("/dashboard/complaints", authMiddleware, roleMiddleware("admin"), getDashboardComplaints);

export default router;
