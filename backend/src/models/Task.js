import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      unique: true, // one task per complaint
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

    // 🔹 lifecycle timestamps
    acceptedAt: {
      type: Date,
      default: Date.now,
    },

    startedAt: Date,

    completedAt: Date,

    incompletedAt: Date, // 🔥 NEW (important)

    // 🔹 proof + notes
    proofImages: [String],

    notes: String,

    // 🔥 FULL HISTORY (timeline tracking)
    history: [
      {
        status: {
          type: String,
          enum: [
            "accepted",
            "in-progress",
            "completed",
            "incompleted",
            "reopened",
          ],
        },

        changedAt: {
          type: Date,
          default: Date.now,
        },

        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Worker",
        },

        note: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);