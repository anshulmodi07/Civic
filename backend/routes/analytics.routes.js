const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const analyticsController = require("../controllers/analytics.controller");

router.get("/complaint-summary", auth, role(["admin"]), analyticsController.complaintSummary);
router.get("/hotspots", auth, role(["admin"]), analyticsController.hotspots);
router.get("/trends", auth, role(["admin"]), analyticsController.trends);
router.get("/risk-zones", auth, role(["admin"]), analyticsController.riskZones);

module.exports = router;
