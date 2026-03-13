const mongoose = require("mongoose");

const hotspotSchema = new mongoose.Schema({
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },

  complaintCount: {
    type: Number,
    default: 0
  },

  complaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint"
    }
  ],

  issueTypes: [
    {
      type: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Hotspot", hotspotSchema);