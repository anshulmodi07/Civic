const mongoose = require("mongoose");

const HotspotSchema = new mongoose.Schema(
  {
    issueType: String,

    centerLocation: {
      lat: Number,
      lng: Number,
    },

    frequency: Number,
    severityScore: Number,
    trend: String,
    riskScore: String,
    suggestedAction: String,

    lastUpdated: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotspot", HotspotSchema);
