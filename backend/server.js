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
import { protect } from "./src/middleware/auth.middleware.js";
import roleMiddleware from "./src/middleware/role.middleware.js";
import complaintRoutes from "./src/routes/complaint.routes.js";



dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running 🚀");
});
app.use("/auth", authRoutes);

// server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});