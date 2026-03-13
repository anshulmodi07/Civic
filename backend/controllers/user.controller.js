const User = require("../models/User.model");

exports.getWorkers = async (req, res) => {
  try {

    const workers = await User.find({
      role: "worker",
      department: req.user.department
    }).select(
      "name department availabilityStatus lastKnownLocation"
    );

    res.json(workers);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAvailability = async (req, res) => {
  const { availabilityStatus } = req.body;

  if (req.user.userId !== req.params.id) {
    return res.status(403).json({ message: "Cannot update other worker" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { availabilityStatus },
    { new: true }
  );

  res.json({
    id: user._id,
    availabilityStatus: user.availabilityStatus,
  });
};

exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;

  if (req.user.userId !== req.params.id) {
    return res.status(403).json({ message: "Cannot update other worker" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      lastKnownLocation: { lat, lng },
    },
    { new: true }
  );

  res.json({
    id: user._id,
    lastKnownLocation: user.lastKnownLocation,
  });
};
