import express from "express";
import {
  getAvailableTasks,
  acceptTask,
  getMyTasks,
  startTask,
  completeTask,
  markIncomplete,
  reviveTask,
  getTaskById   // ✅ ADD THIS
} from "../controllers/task.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();



router.get(
  "/available",
  authMiddleware,
  roleMiddleware("worker"),
  getAvailableTasks
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("worker"),
  getMyTasks
);

router.get(
  "/:taskId",
  authMiddleware,
  roleMiddleware("worker"),
  getTaskById
);


router.post(
  "/:complaintId/accept",
  authMiddleware,
  roleMiddleware("worker"),
  acceptTask
);



router.post(
  "/:taskId/start",
  authMiddleware,
  roleMiddleware("worker"),
  startTask
);

// 🔥 ADD THESE 👇

router.post(
  "/:taskId/complete",
  authMiddleware,
  roleMiddleware("worker"),
  completeTask
);

router.post(
  "/:taskId/incomplete",
  authMiddleware,
  roleMiddleware("worker"),
  markIncomplete
);

router.post(
  "/:taskId/revive",
  authMiddleware,
  roleMiddleware("worker"),
  reviveTask
);

export default router;