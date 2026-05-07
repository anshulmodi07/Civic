import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Worker from "./src/models/worker.js";
import Admin from "./src/models/admin.js";
import Department from "./src/models/department.js";
import Complaint from "./src/models/Complaint.js";
import User from "./src/models/User.js";
import ShiftHistory from "./src/models/shift.js";

dotenv.config({ override: true });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/civicmitra";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");

    // clear old data
    await Worker.deleteMany();
    await Admin.deleteMany();
    await Department.deleteMany();
    await Complaint.deleteMany();
    await User.deleteMany();
    await ShiftHistory.deleteMany(); // 🔥 IMPORTANT

    // departments
    const departments = await Department.insertMany([
      { name: "wifi" },
      { name: "plumber" },
      { name: "civil" },
      { name: "electrician" },
      { name: "carpenter" },
    ]);

    console.log("Departments created ✅");

    // password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // workers
    const workers = await Worker.insertMany([
      {
        name: "Worker Wifi",
        email: "wifi@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "wifi")._id,
        dateOfJoining: new Date("2024-01-15"),
      },
      {
        name: "Worker Wifi 2",
        email: "wifi2@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "wifi")._id,
        dateOfJoining: new Date("2024-02-01"),
      },
      {
        name: "Worker Plumber",
        email: "plumber@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "plumber")._id,
        dateOfJoining: new Date("2024-01-18")
      },
      {
        name: "Worker Electrician",
        email: "electric@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "electrician")._id,
        dateOfJoining: new Date("2023-08-20")
      },
    ]);

    console.log("Workers created ✅");

    // 🔥 get workers
    const wifiWorker = workers.find(w => w.email === "wifi@nitdelhi.ac.in");
    const plumberWorker = workers.find(w => w.email === "plumber@nitdelhi.ac.in");
    const electricWorker = workers.find(w => w.email === "electric@nitdelhi.ac.in");

    // admins
    await Admin.insertMany([
      { name: "Admin Wifi", email: "wifi@civic.com", password: hashedPassword, departmentId: departments.find(d => d.name === "wifi")._id },
      { name: "Admin Plumber", email: "plumber@civic.com", password: hashedPassword, departmentId: departments.find(d => d.name === "plumber")._id },
      { name: "Admin Civil", email: "civil@civic.com", password: hashedPassword, departmentId: departments.find(d => d.name === "civil")._id },
      { name: "Admin Electrician", email: "electric@civic.com", password: hashedPassword, departmentId: departments.find(d => d.name === "electrician")._id },
      { name: "Admin Carpenter", email: "carpenter@civic.com", password: hashedPassword, departmentId: departments.find(d => d.name === "carpenter")._id },
      { name: "Admin", email: "admin@nitdelhi.ac.in", password: hashedPassword, departmentId: departments[0]._id },
    ]);

    console.log("Admin created ✅");

    // user
    const user = await User.create({
      name: "Demo User",
      email: "demo@nitdelhi.ac.in",
      password: hashedPassword,
    });

    // complaints
    await Complaint.insertMany([
      {
        userId: user._id,
        type: "hostel",
        visibility: "private",
        hostelName: "Dhaula",
        floor: "2",
        roomNumber: "203",
        description: "AC not working properly in room, temperature not cooling at all.",
        issueType: "ac",
        departmentId: departments.find(d => d.name === "electrician")._id,
        status: "pending",
        location: { lat: 28.545, lng: 77.192 },
        supporters: [],
        comments: [],
        images: [],
      },
      {
        userId: user._id,
        type: "campus",
        area: "Main Gate",
        locationAddress: "Near college road",
        description: "Street light not working near main gate area since last week.",
        issueType: "electrician",
        departmentId: departments.find(d => d.name === "electrician")._id,
        status: "pending",
        location: { lat: 28.546, lng: 77.193 },
        supporters: [],
        comments: [],
        images: [],
      },
      {
        userId: user._id,
        type: "hostel",
        visibility: "public",
        hostelName: "Dhaula",
        floor: "1",
        landmark: "Near stairs",
        description: "WiFi not working in hostel area, students unable to attend online classes.",
        issueType: "wifi",
        departmentId: departments.find(d => d.name === "wifi")._id,
        status: "pending",
        location: { lat: 28.547, lng: 77.194 },
        supporters: [],
        comments: [],
        images: [],
      },
    ]);

    console.log("Complaints created ✅");

    // 🔥 SHIFT HISTORY
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    await ShiftHistory.insertMany([
      {
        workerId: wifiWorker._id,
        date: today,
        shift: "morning",
      },
      {
        workerId: wifiWorker._id,
        date: yesterday,
        shift: "off",
      },
      {
        workerId: plumberWorker._id,
        date: today,
        shift: "evening",
      },
      {
        workerId: electricWorker._id,
        date: today,
        shift: "morning",
      },
    ]);

    console.log("Shift history created ✅");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
