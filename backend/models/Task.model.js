const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["assigned", "accepted", "in-progress", "resolved"],
      default: "assigned",
    },

    proofImages: [String],

    notes: String,

    assignedAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: Date,

    startedAt: Date,

    completedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
