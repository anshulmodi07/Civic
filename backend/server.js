import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";

import connectDB from "./src/config/db.js";

import "./src/models/Complaint.js";
import "./src/models/Task.js";
import "./src/models/User.js";
import "./src/models/department.js";
import "./src/models/interaction.js";
import "./src/models/shift.js";
import "./src/models/worker.js";

import adminRoutes from "./src/routes/admin.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import complaintRoutes from "./src/routes/complaint.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import workerRoutes from "./src/routes/worker.routes.js";

dotenv.config({ override: true });

const app = express();

connectDB();

fs.mkdirSync(path.join(process.cwd(), "uploads", "complaints"), { recursive: true });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/workers", workerRoutes);
app.use("/complaints", complaintRoutes);
app.use("/departments", departmentRoutes);
app.use("/admin", adminRoutes);

// Legacy /api mounts kept while the app migrates to a base URL without /api.
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
