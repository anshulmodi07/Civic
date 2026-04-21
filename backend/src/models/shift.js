import mongoose from "mongoose";

const shiftHistorySchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  shift: {
    type: String,
    enum: ["morning", "evening", "night", "off"],
    required: true,
  },
});

export default mongoose.model("ShiftHistory", shiftHistorySchema);