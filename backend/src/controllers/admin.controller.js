import Worker from "../models/worker.js";
import ShiftHistory from "../models/shift.js";
import Complaint from "../models/complaint.js";
import Admin from "../models/admin.js";

// ==========================
// GET WORKERS FOR DEPARTMENT
// ==========================
export const getWorkers = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const workers = await Worker.find({ departmentId: admin.departmentId }).select("-password");

    // Fetch shifts for today
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const workerIds = workers.map(w => w._id);
    const todayShifts = await ShiftHistory.find({
      workerId: { $in: workerIds },
      date: { $gte: start, $lte: end },
    });

    const shiftMap = {};
    todayShifts.forEach(s => {
      shiftMap[s.workerId.toString()] = s.shift;
    });

    const enhancedWorkers = workers.map(w => ({
      ...w.toObject(),
      currentShift: shiftMap[w._id.toString()] || "off",
    }));

    res.json(enhancedWorkers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// GET SHIFT SCHEDULE
// ==========================
export const getSchedule = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    const workers = await Worker.find({ departmentId: admin.departmentId });
    const workerIds = workers.map(w => w._id);

    // Fetch last 14 days of shifts to build the schedule view
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const shifts = await ShiftHistory.find({
      workerId: { $in: workerIds },
      date: { $gte: fromDate }
    });

    const schedule = {};
    const getDayFromDate = (date) => {
      const d = new Date(date);
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
    };

    shifts.forEach(entry => {
      const workerIdStr = entry.workerId.toString();
      const day = getDayFromDate(entry.date);
      if (!schedule[workerIdStr]) {
        schedule[workerIdStr] = {};
      }
      schedule[workerIdStr][day] = entry.shift;
    });

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// SAVE SHIFT SCHEDULE
// ==========================
export const saveSchedule = async (req, res) => {
  try {
    const schedule = req.body;
    const daysMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
    const today = new Date();
    const currentDay = today.getDay();

    const promises = [];

    for (const workerId of Object.keys(schedule)) {
      for (const [day, shift] of Object.entries(schedule[workerId])) {
        const targetDay = daysMap[day];
        const diff = targetDay - currentDay;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        targetDate.setHours(12, 0, 0, 0);

        const start = new Date(targetDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(targetDate);
        end.setHours(23, 59, 59, 999);

        promises.push(
          ShiftHistory.findOneAndUpdate(
            { workerId, date: { $gte: start, $lte: end } },
            { workerId, date: targetDate, shift },
            { upsert: true, new: true }
          )
        );
      }
    }

    await Promise.all(promises);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// GET DASHBOARD STATS
// ==========================
export const getDashboardStats = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    const departmentId = admin.departmentId;

    const totalComplaints = await Complaint.countDocuments({ departmentId });
    const resolvedComplaints = await Complaint.countDocuments({ departmentId, status: "closed" });
    const pendingComplaints = totalComplaints - resolvedComplaints;

    const workers = await Worker.find({ departmentId });
    const workerIds = workers.map(w => w._id);

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const activeShifts = await ShiftHistory.countDocuments({
      workerId: { $in: workerIds },
      date: { $gte: start, $lte: end },
      shift: { $ne: "off" }
    });

    const STAT_TEMPLATE = [
      { key: "total", label: "Total Complaints", icon: "alert", iconBg: "#EFF6FF", iconClr: "#2563EB", barClr: "#2563EB", num: totalComplaints, sub: "All complaints", dir: "up", barW: Math.min(totalComplaints * 10, 100) },
      { key: "resolved", label: "Resolved", icon: "check", iconBg: "#ECFDF5", iconClr: "#059669", barClr: "#059669", num: resolvedComplaints, sub: "Closed", dir: "up", barW: totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0 },
      { key: "pending", label: "Pending", icon: "clock", iconBg: "#FFFBEB", iconClr: "#D97706", barClr: "#D97706", num: pendingComplaints, sub: "Open", dir: "flat", barW: totalComplaints ? Math.round((pendingComplaints / totalComplaints) * 100) : 0 },
      { key: "workers", label: "Active Workers", icon: "users", iconBg: "#F5F3FF", iconClr: "#7C3AED", barClr: "#7C3AED", num: activeShifts, sub: "On duty", dir: "up", barW: workers.length ? Math.round((activeShifts / workers.length) * 100) : 0 }
    ];

    res.json({ stats: STAT_TEMPLATE });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// GET DASHBOARD COMPLAINTS
// ==========================
export const getDashboardComplaints = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    const complaints = await Complaint.find({ departmentId: admin.departmentId }).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
