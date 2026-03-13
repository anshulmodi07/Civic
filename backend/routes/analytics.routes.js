const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const analyticsController = require("../controllers/analytics.controller");


router.get("/heatmap", analyticsController.getHeatmap);

router.get(
  "/department-stats",
  auth,
  role(["admin"]),
  analyticsController.getDepartmentStats
);

router.get(
  "/worker-performance",
  auth,
  role(["admin"]),
  analyticsController.getWorkerPerformance
);

router.get(
  "/hotspots",
  auth,
  role(["admin"]),
  analyticsController.getHotspots
);


module.exports = router;