const Complaint = require("../models/Complaint.model");
const AuditLog = require("../models/AuditLog.model");

exports.createComplaint = async (req, res) => {
  const { description, location, images } = req.body;

  const complaint = await Complaint.create({
    citizenId: req.user.userId,
    description,
    location,
    images,
  });

  res.status(201).json({
    id: complaint._id,
    status: complaint.status,
  });
};

exports.getMyComplaints = async (req, res) => {
  const complaints = await Complaint.find({ citizenId: req.user.userId });
  res.json(complaints);
};

exports.getAllComplaints = async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
};

exports.getComplaintById = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  res.json(complaint);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const complaint = await Complaint.findById(req.params.id);

  const oldStatus = complaint.status;
  complaint.status = status;
  await complaint.save();

  await AuditLog.create({
    actionType: "STATUS_UPDATE",
    performedBy: req.user.userId,
    entityType: "complaint",
    entityId: complaint._id,
    oldStatus,
    newStatus: status,
  });

  res.json({ message: "Status updated" });
};
