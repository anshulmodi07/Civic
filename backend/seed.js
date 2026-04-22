import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import Worker from "./src/models/worker.js";
import Admin from "./src/models/admin.js";
import Department from "./src/models/department.js";
import Complaint from "./src/models/complaint.js";
import User from "./src/models/user.js";
import ShiftHistory from "./src/models/shift.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
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
    ]);

    console.log("Workers created ✅");

    // 🔥 get workers
    const wifiWorker = workers.find(w => w.email === "wifi@nitdelhi.ac.in");
    const plumberWorker = workers.find(w => w.email === "plumber@nitdelhi.ac.in");

    // admin
    await Admin.create({
      name: "Admin",
      email: "admin@nitdelhi.ac.in",
      password: hashedPassword,
      departmentId: departments[0]._id,
    });

    console.log("Admin created ✅");

    // user
    const user = await User.create({
      name: "Test User",
      email: "user@nitdelhi.ac.in",
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
        description: "AC not working properly in room.",
        departmentId: departments.find(d => d.name === "electrician")._id,
        status: "pending",
        location: { lat: 28.545, lng: 77.192 },
        images: [],
      },
      {
        userId: user._id,
        type: "campus",
        area: "Main Gate",
        locationAddress: "Near college road",
        description: "Street light not working.",
        departmentId: departments.find(d => d.name === "electrician")._id,
        status: "pending",
        location: { lat: 28.546, lng: 77.193 },
        images: [],
      },
      {
        userId: user._id,
        type: "hostel",
        visibility: "public",
        hostelName: "Dhaula",
        floor: "1",
        landmark: "Near stairs",
        description: "WiFi not working in hostel area.",
        departmentId: departments.find(d => d.name === "wifi")._id,
        status: "pending",
        location: { lat: 28.547, lng: 77.194 },
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
    ]);

    console.log("Shift history created ✅");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();