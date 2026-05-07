import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["hostel", "campus"],
      required: true,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      required: function () {
        return this.type === "hostel";
      },
    },

    hostelName: {
      type: String,
      required: function () {
        return this.type === "hostel";
      },
    },

    floor: {
      type: String,
      required: function () {
        return this.type === "hostel";
      },
    },

    roomNumber: {
      type: String,
      required: function () {
        return this.type === "hostel" && this.visibility === "private";
      },
    },

    landmark: {
      type: String,
      required: function () {
        return this.type === "hostel" && this.visibility === "public";
      },
    },

    area: {
      type: String,
      required: function () {
        return this.type === "campus";
      },
    },

    locationAddress: {
      type: String,
      required: function () {
        return this.type === "campus";
      },
    },

    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 500,
    },

    // Frontend sends issueType for categorization
    issueType: {
      type: String,
      enum: [
        "electrician",
        "plumber",
        "ac",
        "wifi",
        "sanitation",
        "construction",
        "pest_control",
        "furniture",
        "other",
      ],
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "new",
        "pending",
        "assigned",
        "accepted",
        "in-progress",
        "completed",
        "incompleted",
        "closed",
      ],
      default: "pending",
      index: true,
    },

    // Upvote/support tracking
    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Comments on the complaint
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Worker assignment
    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },

    assignedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
    },

    images: [String],
  },
  { timestamps: true }
);

complaintSchema.index({ coordinates: "2dsphere" });


complaintSchema.pre("validate", function () {
  if (this.type === "campus") {
    this.visibility = "public";
  }

  if (Number.isFinite(this.location?.lat) && Number.isFinite(this.location?.lng)) {
    this.coordinates = {
      type: "Point",
      coordinates: [this.location.lng, this.location.lat],
    };
  }
});

export default mongoose.model("Complaint", complaintSchema);
