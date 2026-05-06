import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

import connectDB from "./src/config/db.js";

import "./src/models/department.js";
import "./src/models/worker.js";
import "./src/models/User.js";
import "./src/models/Task.js";
import "./src/models/Complaint.js";
import "./src/models/shift.js";
import "./src/models/interaction.js";

import authRoutes from "./src/routes/auth.routes.js";
import complaintRoutes from "./src/routes/complaint.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";

dotenv.config();

const app = express();

connectDB();

fs.mkdirSync(path.join(process.cwd(), "uploads", "complaints"), { recursive: true });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/complaints", complaintRoutes);
app.use("/tasks", taskRoutes);
app.use("/departments", departmentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local API: http://localhost:${PORT}`);
});
