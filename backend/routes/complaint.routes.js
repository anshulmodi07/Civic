const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const complaintController = require("../controllers/complaint.controller");

/* Citizen routes */

router.post("/", auth, role("citizen"), complaintController.createComplaint);

router.get("/my", auth, role("citizen"), complaintController.getMyComplaints);

router.get("/nearby", auth, complaintController.getNearbyComplaints);

router.post("/:id/support", auth, role("citizen"), complaintController.supportComplaint);

router.post("/:id/comment", auth, complaintController.addComment);

router.get("/:id/comments", auth, complaintController.getComments);

router.get("/:id/timeline", auth, complaintController.getComplaintTimeline);

router.get("/", auth, role("admin"), complaintController.getAllComplaints);

router.patch("/:id/status", auth, role("admin"), complaintController.updateStatus);

router.get("/:id", auth, complaintController.getComplaintById);

module.exports = router;