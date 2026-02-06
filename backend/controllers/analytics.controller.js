exports.complaintSummary = async (req, res) => {
  res.json({
    water: 10,
    electricity: 5,
    road: 7,
    garbage: 3,
  });
};

exports.hotspots = async (req, res) => {
  res.json([]);
};

exports.trends = async (req, res) => {
  res.json([]);
};

exports.riskZones = async (req, res) => {
  res.json([]);
};
