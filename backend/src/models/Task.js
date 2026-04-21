import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      unique: true,
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["accepted", "in-progress", "completed", "incompleted"],
      default: "accepted",
      index: true,
    },

    acceptedAt: { type: Date, default: Date.now },
    startedAt: Date,
    completedAt: Date,

    proofImages: [String],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);