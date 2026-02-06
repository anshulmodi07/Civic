const User = require("../models/User.model");

exports.getWorkers = async (req, res) => {
  const { department } = req.query;

  const filter = {
    role: "worker",
  };

  if (department) {
    filter.skills = department;
  }

  const workers = await User.find(filter).select(
    "name skills availabilityStatus lastKnownLocation"
  );

  res.json(workers);
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
