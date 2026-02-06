const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const taskController = require("../controllers/task.controller");

router.post("/assign", auth, role(["admin"]), taskController.assignTask);
router.get("/my", auth, role(["worker"]), taskController.getMyTasks);
router.patch("/:id/complete", auth, role(["worker"]), taskController.completeTask);
router.patch("/:id/verify", auth, role(["admin"]), taskController.verifyTask);

module.exports = router;
