const Task = require("../models/Task.model");
const Complaint = require("../models/Complaint.model");
const AuditLog = require("../models/AuditLog.model");

exports.assignTask = async (req, res) => {
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
};

exports.getMyTasks = async (req, res) => {
  const tasks = await Task.find({ workerId: req.user.userId })
    .populate("complaintId");

  res.json(tasks);
};

exports.completeTask = async (req, res) => {
  const { proofImages } = req.body;

  const task = await Task.findById(req.params.id);
  task.status = "completed";
  task.proofImages = proofImages;
  task.completedAt = new Date();
  await task.save();

  await AuditLog.create({
    actionType: "TASK_COMPLETED",
    performedBy: req.user.userId,
    entityType: "task",
    entityId: task._id,
    oldStatus: "assigned",
    newStatus: "completed",
  });

  res.json({
    status: "completed",
    message: "Task completed, pending admin verification",
  });
};

exports.verifyTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  task.status = "verified";
  task.verifiedAt = new Date();
  await task.save();

  await Complaint.findByIdAndUpdate(task.complaintId, {
    status: "closed",
  });

  await AuditLog.create({
    actionType: "TASK_VERIFIED",
    performedBy: req.user.userId,
    entityType: "task",
    entityId: task._id,
    oldStatus: "completed",
    newStatus: "verified",
  });

  res.json({ status: "closed" });
};
