const Complaint = require("../models/Complaint.model");
const Task = require("../models/Task.model");
const AuditLog = require("../models/AuditLog.model");
const { getSLABreach } = require("../services/sla.service");

exports.getComplaintsByDepartment = async (req, res) => {
  const { type } = req.params;
  const complaints = await Complaint.find({ issueType: type });
  res.json(complaints);
};

exports.getDashboardStats = async (req, res) => {
  const totalComplaints = await Complaint.countDocuments();
  const open = await Complaint.countDocuments({ status: { $ne: "closed" } });
  const closed = await Complaint.countDocuments({ status: "closed" });

  res.json({
    totalComplaints,
    open,
    closed,
  });
};

exports.getPendingTasks = async (req, res) => {
  const tasks = await Task.find({ status: { $ne: "verified" } })
    .populate("complaintId")
    .populate("workerId", "name");

  res.json(tasks);
};

exports.getSLAViolations = async (req, res) => {
  const complaints = await Complaint.find({ status: { $ne: "closed" } });
  const violations = complaints.filter(getSLABreach);
  res.json(violations);
};

exports.getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(logs);
};
