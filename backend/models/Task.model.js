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
      enum: ["assigned", "completed", "verified"],
      default: "assigned",
    },

    proofImages: [String],

    assignedAt: Date,
    completedAt: Date,
    verifiedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
