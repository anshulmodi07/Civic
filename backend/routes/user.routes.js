const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const userController = require("../controllers/user.controller");

// Admin: get his/her dept workers
router.get("/workers", auth, role("admin"), userController.getWorkers);

// Worker: update availability
router.patch("/:id/availability", auth, role(["worker"]), userController.updateAvailability);

// Worker: update location
router.patch("/:id/location", auth, role(["worker"]), userController.updateLocation);

module.exports = router;
