const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/User.model");
const Complaint = require("../models/Complaint.model");

const demoUsers = require("./demoUsers");
const demoComplaints = require("./demoComplaints");

const seedData = async () => {
  await connectDB();

  await User.deleteMany();
  await Complaint.deleteMany();

  const users = await User.insertMany(demoUsers);

  const citizen = users.find(u => u.role === "admin"); // demo citizen substitute

  const complaints = demoComplaints(citizen._id);
  await Complaint.insertMany(complaints);

  console.log("✅ Demo data seeded successfully");
  process.exit();
};

seedData();
