import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["wifi", "plumber", "civil", "electrician"],
    required: true,
    unique: true,
  },
});

export default mongoose.model("Department", departmentSchema);