const Complaint = require("../models/Complaint.model");
const AuditLog = require("../models/AuditLog.model");

/* ===============================
   CREATE COMPLAINT
================================ */

exports.createComplaint = async (req, res) => {
  try {
    const { description, issueType, location, images } = req.body;

    const complaint = await Complaint.create({
      citizenId: req.user.userId,
      description,
      issueType,
      location,
      images
    });

    res.status(201).json({
      id: complaint._id,
      status: complaint.status
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   GET MY COMPLAINTS
================================ */

exports.getMyComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find({
      citizenId: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(complaints);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   GET ALL COMPLAINTS (ADMIN)
================================ */

exports.getAllComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find()
      .populate("citizenId", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   GET COMPLAINT BY ID
================================ */

exports.getComplaintById = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id)
      .populate("citizenId", "name email");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   NEARBY COMPLAINTS
================================ */

exports.getNearbyComplaints = async (req, res) => {
  try {

    const { lat, lng } = req.query;

    const complaints = await Complaint.find({
      "location.lat": {
        $gte: lat - 0.01,
        $lte: lat + 0.01
      },
      "location.lng": {
        $gte: lng - 0.01,
        $lte: lng + 0.01
      }
    });

    res.json(complaints);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   SUPPORT COMPLAINT
================================ */

exports.supportComplaint = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    if (!complaint.supporters.includes(req.user.userId)) {
      complaint.supporters.push(req.user.userId);
      await complaint.save();
    }

    res.json({
      message: "Complaint supported",
      supporters: complaint.supporters.length
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   ADD COMMENT
================================ */

exports.addComment = async (req, res) => {
  try {

    const { text } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    complaint.comments.push({
      userId: req.user.userId,
      text
    });

    await complaint.save();

    res.json({
      message: "Comment added"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   GET COMMENTS
================================ */

exports.getComments = async (req, res) => {
  try {

    const complaint = await Complaint.findById(req.params.id)
      .populate("comments.userId", "name");

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    res.json(complaint.comments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   COMPLAINT TIMELINE
================================ */

exports.getComplaintTimeline = async (req, res) => {
  try {

    const logs = await AuditLog.find({
      entityType: "complaint",
      entityId: req.params.id
    }).sort({ createdAt: 1 });

    res.json(logs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   UPDATE STATUS (ADMIN)
================================ */

exports.updateStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    const oldStatus = complaint.status;

    complaint.status = status;

    await complaint.save();

    await AuditLog.create({
      actionType: "STATUS_UPDATE",
      performedBy: req.user.userId,
      entityType: "complaint",
      entityId: complaint._id,
      oldStatus,
      newStatus: status
    });

    res.json({
      message: "Status updated"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};