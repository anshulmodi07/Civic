const Complaint = require("../models/Complaint.model");
const Task = require("../models/Task.model");

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


/* ===============================
   DEPARTMENT STATS
================================ */

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


/* ===============================
   WORKER PERFORMANCE
================================ */

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


/* ===============================
   HOTSPOT DETECTION
================================ */

exports.getHotspots = async (req, res) => {
  try {

    const complaints = await Complaint.find({
      status: { $ne: "closed" }
    });

    const hotspots = [];

    complaints.forEach(c => {

      const existing = hotspots.find(h =>
        Math.abs(h.lat - c.location.lat) < 0.001 &&
        Math.abs(h.lng - c.location.lng) < 0.001
      );

      if (existing) {

        existing.count += 1;
        existing.complaints.push(c._id);
        existing.issueTypes.push(c.issueType);

      } else {

        hotspots.push({
          lat: c.location.lat,
          lng: c.location.lng,
          count: 1,
          complaints: [c._id],
          issueTypes: [c.issueType]
        });

      }

    });

    const result = hotspots.filter(h => h.count >= 3);

    res.json({
      hotspots: result
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }
};