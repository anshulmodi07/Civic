import express from "express";
import {
  addComment,
  createComplaint,
  deleteComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintTimeline,
  getMyComplaints,
  getNearbyComplaints,
  listComments,
  toggleSupport,
  updateComplaint,
} from "../controllers/complaint.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadComplaintImages } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, uploadComplaintImages.array("images", 5), createComplaint);
router.get("/", getAllComplaints);
router.get("/nearby", getNearbyComplaints);
router.get("/my", protect, getMyComplaints);
router.get("/:id", getComplaintById);
router.get("/:id/timeline", getComplaintTimeline);
router.get("/:id/comments", listComments);
router.post("/:id/comments", protect, addComment);
router.post("/:id/support", protect, toggleSupport);
router.put("/:id", protect, uploadComplaintImages.array("images", 5), updateComplaint);
router.delete("/:id", protect, deleteComplaint);

export default router;
