const User = require("../models/User.model");

/* ===============================
   GET WORKERS (ADMIN)
================================ */

exports.getWorkers = async (req, res) => {
  try {

    const workers = await User.find({
      role: "worker",
      department: req.user.department
    }).select("name department availabilityStatus lastKnownLocation");

    res.json(workers);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   UPDATE WORKER AVAILABILITY
================================ */

exports.updateAvailability = async (req, res) => {
  try {

    const { availabilityStatus } = req.body;

    if (!availabilityStatus) {
      return res.status(400).json({
        message: "availabilityStatus required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { availabilityStatus },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Worker not found"
      });
    }

    res.json({
      id: user._id,
      availabilityStatus: user.availabilityStatus
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   UPDATE WORKER LOCATION
================================ */

exports.updateLocation = async (req, res) => {
  try {

    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "lat and lng required"
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        lastKnownLocation: { lat, lng }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "Worker not found"
      });
    }

    res.json({
      id: user._id,
      lastKnownLocation: user.lastKnownLocation
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};