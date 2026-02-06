const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    actionType: String,

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    entityType: {
      type: String,
      enum: ["complaint", "task"],
    },

    entityId: mongoose.Schema.Types.ObjectId,

    oldStatus: String,
    newStatus: String,

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", AuditLogSchema);
