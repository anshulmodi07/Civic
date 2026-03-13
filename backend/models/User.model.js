const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    passwordHash: {
      type: String
    }, // unused for MVP

    role: {
      type: String,
      enum: ["citizen", "worker", "admin"],
      required: true
    },

    department: {
      type: String,
      enum: ["water", "electricity", "road", "sanitation"],
      default: null
    },

    skills: [
      {
        type: String
      }
    ],

    availabilityStatus: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available"
    },

    lastKnownLocation: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);