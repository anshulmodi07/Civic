import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },

    password: { type: String, required: true },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    dateOfJoining: Date,
    position: String,
    phoneNumber: String,

    totalTasks: { type: Number, default: 0 },
    remainingTasks: { type: Number, default: 0 },

    currentShift: {
      type: String,
      enum: ["morning", "evening", "night", "off"],
      default: "off",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Worker", workerSchema);