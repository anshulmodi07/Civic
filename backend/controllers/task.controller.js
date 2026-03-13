const Task = require("../models/Task.model");
const Complaint = require("../models/Complaint.model");
const AuditLog = require("../models/AuditLog.model");

/* ===============================
   ADMIN ASSIGNS TASK
================================ */

exports.assignTask = async (req, res) => {
  try {
    const { complaintId, workerId } = req.body;

    const task = await Task.create({
      complaintId,
      workerId,
      status: "assigned",
      assignedAt: new Date(),
    });

    await Complaint.findByIdAndUpdate(complaintId, {
      status: "assigned",
      assignedTaskId: task._id,
    });

    await AuditLog.create({
      actionType: "TASK_ASSIGNED",
      performedBy: req.user.userId,
      entityType: "complaint",
      entityId: complaintId,
      oldStatus: "new",
      newStatus: "assigned",
    });

    res.status(201).json({
      taskId: task._id,
      status: task.status,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   WORKER DASHBOARD
================================ */

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      workerId: req.user.userId,
    }).populate("complaintId");

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   WORKER ACCEPT TASK
================================ */

exports.acceptTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    task.status = "accepted";
    task.acceptedAt = new Date();

    await task.save();

    res.json({
      status: "accepted",
      message: "Task accepted",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   WORKER START TASK
================================ */

exports.startTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    task.status = "in-progress";
    task.startedAt = new Date();

    await task.save();

    await Complaint.findByIdAndUpdate(task.complaintId, {
      status: "in-progress",
    });

    res.json({
      status: "in-progress",
      message: "Work started",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   WORKER COMPLETE TASK
================================ */

exports.completeTask = async (req, res) => {
  try {

    const { proofImages, notes } = req.body;

    const task = await Task.findById(req.params.id);

    task.status = "resolved";
    task.proofImages = proofImages;
    task.notes = notes;
    task.completedAt = new Date();

    await task.save();

    await Complaint.findByIdAndUpdate(task.complaintId, {
      status: "closed",
    });

    await AuditLog.create({
      actionType: "TASK_RESOLVED",
      performedBy: req.user.userId,
      entityType: "task",
      entityId: task._id,
      oldStatus: "in-progress",
      newStatus: "resolved",
    });

    res.json({
      status: "resolved",
      message: "Task completed successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
