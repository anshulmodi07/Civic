const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const taskController = require("../controllers/task.controller");

/* Admin assigns worker */

router.post("/assign", auth, role("admin"), taskController.assignTask);

/* Worker dashboard */

router.get("/my", auth, role("worker"), taskController.getMyTasks);

/* Worker actions */

router.patch("/:id/accept", auth, role("worker"), taskController.acceptTask);

router.patch("/:id/start", auth, role("worker"), taskController.startTask);

router.patch("/:id/complete", auth, role("worker"), taskController.completeTask);

module.exports = router;
