import express from "express";
import { createComplaint } from "../controllers/complaint.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("citizen"),
  createComplaint
);

export default router;