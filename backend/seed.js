import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import Worker from "./src/models/worker.js";
import Admin from "./src/models/admin.js";
import Department from "./src/models/department.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");

    // 🧹 Optional: clear old data
    await Worker.deleteMany();
    await Admin.deleteMany();
    await Department.deleteMany();

    // 🔥 1. Create Departments
    const departments = await Department.insertMany([
      { name: "wifi" },
      { name: "plumber" },
      { name: "civil" },
      { name: "electrician" },
    ]);

    console.log("Departments created ✅");

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 🔥 2. Create Workers
    const workers = await Worker.insertMany([
      {
        name: "Worker Wifi",
        email: "wifi@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "wifi")._id,
      },
      {
        name: "Worker Plumber",
        email: "plumber@nitdelhi.ac.in",
        password: hashedPassword,
        departmentId: departments.find(d => d.name === "plumber")._id,
      },
    ]);

    console.log("Workers created ✅");

    // 🔥 3. Create Admin
    await Admin.create({
      name: "Admin",
      email: "admin@nitdelhi.ac.in",
      password: hashedPassword,
      departmentId: departments[0]._id, // optional
    });

    console.log("Admin created ✅");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();