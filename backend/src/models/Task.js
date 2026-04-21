import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      unique: true, //  prevents duplicate tasks
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["assigned", "accepted", "in-progress", "completed"],
      default: "assigned",
      index: true,
    },

    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,

    proofImages: [String],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);