require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const express = require("express");


const connectDB = require("./config/db");

const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const complaintRoutes = require("./routes/complaint.routes");
const taskRoutes = require("./routes/task.routes");
const adminRoutes = require("./routes/admin.routes");
const analyticsRoutes = require("./routes/analytics.routes");





const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
console.log("Analytics routes loaded");


app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
