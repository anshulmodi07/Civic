import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  // OAuth → no password needed
});

export default mongoose.model("User", userSchema);