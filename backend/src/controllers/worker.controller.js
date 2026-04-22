import Worker from "../models/worker.js";
import Task from "../models/task.js";
import ShiftHistory from "../models/shift.js";


// 🔹 PROFILE
export const getMyProfile = async (req, res) => {
  try {
    const worker = await Worker.findById(req.user.id)
      .populate("departmentId", "name")
      .select("name email departmentId position phoneNumber dateOfJoining");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.json({
      name: worker.name,
      email: worker.email,
      department: worker.departmentId?.name,
      position: worker.position,
      phoneNumber: worker.phoneNumber,
      dateOfJoining: worker.dateOfJoining,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { phoneNumber, position } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { phoneNumber, position },
      { new: true }
    ).select("name email phoneNumber position");

    res.json(worker);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 STATS
export const getWorkerStats = async (req, res) => {
  try {
    const workerId = req.user.id;

    const [total, active, completed, incompleted] = await Promise.all([
      Task.countDocuments({ workerId }),
      Task.countDocuments({
        workerId,
        status: { $in: ["accepted", "in-progress"] },
      }),
      Task.countDocuments({
        workerId,
        status: "completed",
      }),
      Task.countDocuments({
        workerId,
        status: "incompleted",
      }),
    ]);

    const completionRate =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    res.json({
      total,
      active,
      completed,
      incompleted,
      completionRate,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔹 ATTENDANCE
export const getAttendance = async (req, res) => {
  try {
    const workerId = req.user.id;

    const [daysWorked, daysOff] = await Promise.all([
      ShiftHistory.countDocuments({
        workerId,
        shift: { $ne: "off" },
      }),
      ShiftHistory.countDocuments({
        workerId,
        shift: "off",
      }),
    ]);

    res.json({
      daysWorked,
      daysOff,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔹 TODAY SHIFT
export const getTodayShift = async (req, res) => {
  try {
    const workerId = req.user.id;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const shift = await ShiftHistory.findOne({
      workerId,
      date: { $gte: start, $lte: end },
    });

    res.json({
      shift: shift?.shift || "off",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};