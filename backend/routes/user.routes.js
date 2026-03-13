const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const userController = require("../controllers/user.controller");


/* ===============================
   ADMIN ROUTES
================================ */

// Get workers of admin's department
router.get(
  "/workers",
  auth,
  role("admin"),
  userController.getWorkers
);


/* ===============================
   WORKER ROUTES
================================ */

// Update worker availability
router.patch(
  "/availability",
  auth,
  role("worker"),
  userController.updateAvailability
);

// Update worker location
router.patch(
  "/location",
  auth,
  role("worker"),
  userController.updateLocation
);


module.exports = router;