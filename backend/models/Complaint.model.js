const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: { type: String, required: true },

    issueType: {
      type: String,
      enum: ["water", "electricity", "road", "garbage", "pending"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    images: [String],

    status: {
      type: String,
      enum: ["new", "assigned", "in-progress", "closed"],
      default: "new",
    },

    assignedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
