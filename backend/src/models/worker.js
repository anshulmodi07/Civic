import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

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
});

export default mongoose.model("Worker", workerSchema);