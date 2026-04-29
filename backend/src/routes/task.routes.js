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

import { protect } from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();



router.get(
  "/available",
  protect,
  roleMiddleware("worker"),
  getAvailableTasks
);

router.get(
  "/my",
  protect,
  roleMiddleware("worker"),
  getMyTasks
);

router.get(
  "/:taskId",
  protect,
  roleMiddleware("worker"),
  getTaskById
);


router.post(
  "/:complaintId/accept",
  protect,
  roleMiddleware("worker"),
  acceptTask
);



router.post(
  "/:taskId/start",
  protect,
  roleMiddleware("worker"),
  startTask
);

// 🔥 ADD THESE 👇

router.post(
  "/:taskId/complete",
  protect,
  roleMiddleware("worker"),
  completeTask
);

router.post(
  "/:taskId/incomplete",
  protect,
  roleMiddleware("worker"),
  markIncomplete
);

router.post(
  "/:taskId/revive",
  protect,
  roleMiddleware("worker"),
  reviveTask
);

export default router;