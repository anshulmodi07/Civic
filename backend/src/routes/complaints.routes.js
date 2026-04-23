// src/routes/complaint.routes.js

import express from "express";
import {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaintService,
  deleteComplaintService,
} from "../controllers/complaint.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/", getAllComplaints);
router.get("/my", protect, getMyComplaints);
router.get("/:id", getComplaintById);
router.put("/:id", protect, updateComplaint);
router.delete("/:id", protect, deleteComplaint);

export default router;