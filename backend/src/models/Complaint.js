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

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending","completed", "incompleted"],
      default: "pending",
      index: true,
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

  if (this.location?.lat && this.location?.lng) {
    this.coordinates = {
      type: "Point",
      coordinates: [this.location.lng, this.location.lat],
    };
  }
});

export default mongoose.model("Complaint", complaintSchema);