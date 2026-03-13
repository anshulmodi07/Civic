const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint.model");

/* ===============================
   HEATMAP DATA
================================ */

exports.getHeatmap = async (req, res) => {
  try {

    const complaints = await Complaint.find().select(
      "location issueType status"
    );

    const heatmap = complaints.map(c => ({
      lat: c.location.lat,
      lng: c.location.lng,
      issueType: c.issueType,
      status: c.status
    }));

    res.json(heatmap);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getDepartmentStats = async (req, res) => {
  try {

    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: "$issueType",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const Task = require("../models/Task.model");

exports.getWorkerPerformance = async (req, res) => {
  try {

    const performance = await Task.aggregate([
      {
        $match: { status: "resolved" }
      },
      {
        $group: {
          _id: "$workerId",
          tasksCompleted: { $sum: 1 }
        }
      }
    ]);

    res.json(performance);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = router;