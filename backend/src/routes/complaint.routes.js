import express from "express";
import {
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  getNearbyComplaints,
  getCitizenDashboard,
  createComplaint,
  toggleSupport,
  addComment,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaint.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// ─── Dashboard (must be before /:id) ──────────────────────────────────────────
router.get("/dashboard/citizen", authMiddleware, getCitizenDashboard);

// ─── Read ──────────────────────────────────────────────────────────────────────
router.get("/", authMiddleware, getAllComplaints);
router.get("/my", authMiddleware, getMyComplaints);
router.get("/nearby", authMiddleware, getNearbyComplaints);
router.get("/:id", authMiddleware, getComplaintById);

// ─── Write ─────────────────────────────────────────────────────────────────────
router.post("/", authMiddleware, createComplaint);
router.post("/:id/support", authMiddleware, toggleSupport);
router.post("/:id/comments", authMiddleware, addComment);

// ─── Update / Delete ───────────────────────────────────────────────────────────
router.patch("/:id/status", authMiddleware, updateComplaintStatus);
router.delete("/:id", authMiddleware, deleteComplaint);

export default router;
