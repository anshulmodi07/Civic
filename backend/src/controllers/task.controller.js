import Complaint from "../models/complaint.js";
import Task from "../models/task.js";
import Worker from "../models/worker.js";

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate("complaintId");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { status } = req.query;

    const filter = { workerId };

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate("complaintId");

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 1. GET AVAILABLE TASKS
export const getAvailableTasks = async (req, res) => {
  try {
    const workerId = req.user.id;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const complaints = await Complaint.find({
      status: "pending",
      departmentId: worker.departmentId,
    });

    res.json(complaints);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 2. ACCEPT TASK
export const acceptTask = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const workerId = req.user.id;

    if (!complaintId) {
      return res.status(400).json({ message: "Complaint ID missing" });
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint || complaint.status !== "pending") {
      return res.status(400).json({ message: "Not available" });
    }

    // ❌ prevent duplicate
    const existingTask = await Task.findOne({ complaintId });

    if (existingTask) {
      return res.status(400).json({ message: "Task already accepted" });
    }

    const task = await Task.create({
      complaintId,
      workerId,
      status: "accepted",
      history: [
        {
          status: "accepted",
          changedBy: workerId,
        },
      ],
    });

    // assign worker
    complaint.assignedWorkerId = workerId;
    await complaint.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};







// 🔥 4. START TASK
export const startTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const workerId = req.user.id;

    const task = await Task.findById(taskId);

    if (!task || task.workerId.toString() !== workerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (task.status !== "accepted") {
      return res.status(400).json({ message: "Task already started or completed" });
    }

    task.status = "in-progress";
    task.startedAt = new Date();

    task.history.push({
      status: "in-progress",
      changedBy: workerId,
    });

    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 5. COMPLETE TASK
export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { proofImages } = req.body || {};
    const workerId = req.user.id;

    const task = await Task.findById(taskId);

    if (!task || task.workerId.toString() !== workerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (task.status !== "in-progress") {
      return res.status(400).json({ message: "Task not in progress" });
    }

    if (!proofImages || proofImages.length === 0) {
      return res.status(400).json({
        message: "Proof images required",
      });
    }

    task.status = "completed";
    task.completedAt = new Date();
    task.proofImages = proofImages;

    task.history.push({
      status: "completed",
      changedBy: workerId,
    });

    await task.save();

    // ✅ update complaint
    const complaint = await Complaint.findById(task.complaintId);

    if (complaint) {
      complaint.status = "completed";
      await complaint.save();
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 6. MARK INCOMPLETE
export const markIncomplete = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { notes } = req.body || {};
    const workerId = req.user.id;

    const task = await Task.findById(taskId);

    

    if (!task || task.workerId.toString() !== workerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (task.status !== "in-progress") {
      return res.status(400).json({ message: "Task not in progress" });
    }
    if (!notes || notes.trim() === "") {
  return res.status(400).json({
    message: "Reason (notes) is required for incomplete task",
  });
}

    task.status = "incompleted";
    task.incompletedAt = new Date();
    task.notes = notes;

    task.history.push({
      status: "incompleted",
      changedBy: workerId,
      note: notes,
    });

    await task.save();

    // 🔥 return to pool
    const complaint = await Complaint.findById(task.complaintId);

    if (complaint) {
      complaint.status = "pending"; // 🔥 IMPORTANT FIX
      complaint.assignedWorkerId = null;
      await complaint.save();
    }

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 7. REVIVE TASK
export const reviveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const workerId = req.user.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "incompleted") {
      return res.status(400).json({ message: "Task is not incomplete" });
    }

    // 🔥 reassign to new worker
    task.workerId = workerId;
    task.status = "accepted";

    task.history.push({
      status: "reopened",
      changedBy: workerId,
    });

    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};