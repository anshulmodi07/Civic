const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const complaintController = require("../controllers/complaint.controller");

router.post("/", auth, role(["citizen"]), complaintController.createComplaint);
router.get("/my", auth, role(["citizen"]), complaintController.getMyComplaints);
router.get("/", auth, role(["admin"]), complaintController.getAllComplaints);
router.get("/:id", auth, complaintController.getComplaintById);
router.patch("/:id/status", auth, role(["admin"]), complaintController.updateStatus);

module.exports = router;
