import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.js";

// 🔥 ADD THESE
import "./src/models/department.js";
import "./src/models/worker.js";
import "./src/models/task.js";
import "./src/models/complaint.js";
import "./src/models/shift.js";

import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import workerRoutes from "./src/routes/worker.routes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// 🔥 ROUTES
app.use("/api/auth", authRoutes);   // <-- fix also here (see below)
app.use("/api/tasks", taskRoutes);
app.use("/api/workers", workerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});