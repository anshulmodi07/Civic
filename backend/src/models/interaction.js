import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["upvote", "comment"],
      required: true,
    },

    commentText: {
      type: String,
      required: function () {
        return this.type === "upvote" || this.type === "comment";
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interaction", interactionSchema);