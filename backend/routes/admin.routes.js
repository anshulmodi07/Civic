const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const adminController = require("../controllers/admin.controller");

router.get("/complaints/department/:type", auth, role(["admin"]), adminController.getComplaintsByDepartment);
router.get("/dashboard/stats", auth, role(["admin"]), adminController.getDashboardStats);
router.get("/tasks/pending", auth, role(["admin"]), adminController.getPendingTasks);
router.get("/sla/violations", auth, role(["admin"]), adminController.getSLAViolations);
router.get("/audit/logs", auth, role(["admin"]), adminController.getAuditLogs);

module.exports = router;
