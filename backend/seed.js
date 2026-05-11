import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Worker from "./src/models/worker.js";
import Admin from "./src/models/admin.js";
import Department from "./src/models/department.js";
import Complaint from "./src/models/complaint.js";
import User from "./src/models/user.js";
import ShiftHistory from "./src/models/shift.js";
import Task from "./src/models/task.js";

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
      {
        name: "Worker Electrician",
        email: "electric@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "electrician")._id,
        dateOfJoining: new Date("2023-08-20")
      },
      {
        name: "Worker Carpenter",
        email: "carpenter@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "carpenter")._id,
        dateOfJoining: new Date("2023-11-10")
      },
    ]);

    console.log("Workers created ✅");

    const wifiWorker = workers.find(w => w.email === "wifi@nitdelhi.ac.in");
    const plumberWorker = workers.find(w => w.email === "plumber@nitdelhi.ac.in");
    const electricWorker = workers.find(w => w.email === "electric@nitdelhi.ac.in");
    const carpenterWorker = workers.find(w => w.email === "carpenter@nitdelhi.ac.in");

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

    // users
    const users = await User.insertMany([
      { name: "Test User", email: "user@nitdelhi.ac.in" },
      { name: "Rahul Sharma", email: "rahul.sharma@nitdelhi.ac.in" },
      { name: "Priya Singh", email: "priya.singh@nitdelhi.ac.in" },
      { name: "Amit Kumar", email: "amit.kumar@nitdelhi.ac.in" },
    ]);
    const user = users[0];

    // complaints
    const complaints = await Complaint.insertMany([
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
        location: { lat: 28.8420, lng: 77.1040 },
        supporters: [],
        comments: [],
        images: [],
      },
      {
        userId: users[1]._id,
        type: "campus",
        area: "Main Gate",
        locationAddress: "Near college road",
        description: "Street light not working near main gate area since last week.",
        issueType: "electrician",
        departmentId: departments.find(d => d.name === "electrician")._id,
        status: "in-progress",
        assignedWorkerId: electricWorker._id,
        location: { lat: 28.8430, lng: 77.1035 },
        supporters: [users[0]._id, users[2]._id, users[3]._id],
        comments: [],
        images: [],
      },
      {
        userId: users[2]._id,
        type: "hostel",
        visibility: "public",
        hostelName: "Dhaula",
        floor: "1",
        landmark: "Near stairs",
        description: "WiFi not working in hostel area, students unable to attend online classes.",
        issueType: "wifi",
        departmentId: departments.find(d => d.name === "wifi")._id,
        status: "in-progress",
        assignedWorkerId: wifiWorker._id,
        location: { lat: 28.8425, lng: 77.1060 },
        supporters: [users[0]._id, users[1]._id],
        comments: [],
        images: [],
      },
      {
        userId: users[3]._id,
        type: "campus",
        area: "Library",
        locationAddress: "Library 1st floor reading area",
        description: "WiFi router is continuously dropping connection, unable to study online.",
        issueType: "wifi",
        departmentId: departments.find(d => d.name === "wifi")._id,
        status: "pending",
        location: { lat: 28.8440, lng: 77.1055 },
        supporters: [users[0]._id, users[1]._id],
        comments: [],
        images: [],
      },
      {
        userId: users[3]._id,
        type: "campus",
        area: "Cafeteria",
        locationAddress: "Student Cafeteria Building",
        description: "Water pipe leaking in the washroom, causing flooding in the corridor.",
        issueType: "plumber",
        departmentId: departments.find(d => d.name === "plumber")._id,
        status: "pending",
        location: { lat: 28.8435, lng: 77.1045 },
        supporters: [users[1]._id],
        comments: [],
        images: [],
      },
      {
        userId: user._id,
        type: "hostel",
        visibility: "private",
        hostelName: "Nilgiri",
        floor: "3",
        roomNumber: "312",
        description: "Chair is broken and table has missing screws. Need replacement.",
        issueType: "furniture",
        departmentId: departments.find(d => d.name === "carpenter")._id,
        status: "closed",
        assignedWorkerId: carpenterWorker._id,
        location: { lat: 28.8415, lng: 77.1050 },
        supporters: [],
        comments: [],
        images: [],
      },
      {
        userId: users[1]._id,
        type: "campus",
        area: "Library",
        locationAddress: "Central Library 2nd Floor",
        description: "Two ceiling fans are making loud noise, disturbing students.",
        issueType: "electrician",
        departmentId: departments.find(d => d.name === "electrician")._id,
        status: "pending",
        location: { lat: 28.8445, lng: 77.1065 },
        supporters: [users[0]._id, users[2]._id, users[3]._id, user._id],
        comments: [],
        images: [],
      },
      {
        userId: users[2]._id,
        type: "campus",
        area: "Sports Complex",
        locationAddress: "Basketball Court",
        description: "Drinking water cooler is dispensing warm water. Need maintenance.",
        issueType: "plumber",
        departmentId: departments.find(d => d.name === "plumber")._id,
        status: "pending",
        location: { lat: 28.8450, lng: 77.1042 },
        supporters: [users[0]._id, users[1]._id, users[3]._id],
        comments: [],
        images: [],
      }
    ]);

    console.log("Complaints created ✅");

    // Tasks for assigned/in-progress complaints
    await Task.deleteMany();
    await Task.insertMany([
      {
        complaintId: complaints[1]._id,
        workerId: electricWorker._id,
        status: "in-progress",
        history: [{ status: "accepted", changedBy: electricWorker._id }, { status: "in-progress", changedBy: electricWorker._id }]
      },
      {
        complaintId: complaints[2]._id,
        workerId: wifiWorker._id,
        status: "in-progress",
        history: [{ status: "accepted", changedBy: wifiWorker._id }, { status: "in-progress", changedBy: wifiWorker._id }]
      },
      {
        complaintId: complaints[5]._id,
        workerId: carpenterWorker._id,
        status: "completed",
        history: [
          { status: "accepted", changedBy: carpenterWorker._id },
          { status: "in-progress", changedBy: carpenterWorker._id },
          { status: "completed", changedBy: carpenterWorker._id }
        ]
      }
    ]);
    console.log("Tasks created ✅");

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
      {
        workerId: carpenterWorker._id,
        date: today,
        shift: "morning",
      },
      {
        workerId: carpenterWorker._id,
        date: yesterday,
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