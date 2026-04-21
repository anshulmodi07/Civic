import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    // 👤 Who created complaint
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 🏷️ Complaint type
    type: {
      type: String,
      enum: ["hostel", "campus"],
      required: true,
    },

    // 🔐 Visibility (only for hostel)
    visibility: {
      type: String,
      enum: ["public", "private"],
      required: function () {
        return this.type === "hostel";
      },
    },

    // 🏢 Hostel fields
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

    // 🔒 Only for private hostel complaints
    roomNumber: {
      type: String,
      required: function () {
        return this.type === "hostel" && this.visibility === "private";
      },
    },

    // 🌍 Only for public hostel complaints
    landmark: {
      type: String,
      required: function () {
        return this.type === "hostel" && this.visibility === "public";
      },
    },

    // 🌐 Campus fields
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

    // 📝 Description
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 500,
    },

    // 🏢 Department (VERY IMPORTANT)
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    // ⚡ Priority (auto later)
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // 📍 Location
    location: {
      lat: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      lng: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },

    // 🌍 GeoJSON for future scaling
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
    },

    // 🖼️ Images
    images: [String],

    // 👍 Supporters (upvotes)
    supporters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 💬 Comments
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🔄 Status lifecycle
    status: {
      type: String,
      enum: ["new", "assigned", "in-progress", "closed"],
      default: "new",
      index: true,
    },

    // 🔗 Task reference
    assignedTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    // ⚡ Optional optimization (fast queries)
    assignedWorkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
  },
  { timestamps: true }
);

// 🌍 Geo index for future location-based queries
complaintSchema.index({ coordinates: "2dsphere" });

// 🔥 Auto-fix: campus always public
complaintSchema.pre("validate", function (next) {
  if (this.type === "campus") {
    this.visibility = "public";
  }

  // sync GeoJSON
  if (this.location?.lat && this.location?.lng) {
    this.coordinates = {
      type: "Point",
      coordinates: [this.location.lng, this.location.lat],
    };
  }

  next();
});

export default mongoose.model("Complaint", complaintSchema);