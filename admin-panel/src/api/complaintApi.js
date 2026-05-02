// src/api/complaintApi.js

const USE_MOCK = true;

import { COMPLAINTS } from "../mock/complaints1";
import { TASKS } from "../mock/tasks";
import { WORKERS } from "../mock/workers1";
import { USERS } from "../mock/user";

/* ======================================================
   HELPERS
====================================================== */

const normalizeDept = (dept) =>
  dept?.toLowerCase().trim();

const delay = (ms = 300) =>
  new Promise(res => setTimeout(res, ms));

/* ======================================================
   GET COMPLAINTS (WITH FULL JOIN)
====================================================== */

const mockGetComplaints = async (departmentId) => {
  await delay();

  const dept = normalizeDept(departmentId);

  // ✅ filter by department
  const filtered = COMPLAINTS.filter(c => {
    const cDept = normalizeDept(c.departmentId);
    return cDept === dept || cDept === `dept-${dept}`;
  });

  // 🔥 JOIN: complaint + task + worker + user
  return filtered.map(c => {
    const task = TASKS.find(t => t.complaintId === c._id);

    const worker = task
      ? WORKERS.find(w => w._id === task.workerId)
      : null;

    const user = USERS.find(u => u._id === c.userId);

    return {
      ...c,

      // ✅ USER JOIN (fixes "Unknown")
      userId: user || {
        _id: null,
        name: "Unknown"
      },

      // ✅ TASK + WORKER JOIN
      task: task
        ? {
            ...task,
            workerId: worker || null
          }
        : null
    };
  });
};

const realGetComplaints = async (departmentId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/complaints?departmentId=${departmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  return data.complaints;
};

export const getComplaints = async (departmentId) => {
  return USE_MOCK
    ? mockGetComplaints(departmentId)
    : realGetComplaints(departmentId);
};

/* ======================================================
   CREATE COMPLAINT
====================================================== */

const mockCreateComplaint = async (payload) => {
  await delay();

  const newComplaint = {
    _id: `cmp${Date.now()}`,
    ...payload,
    status: "pending",
    createdAt: new Date(),
    images: payload.images || []
  };

  COMPLAINTS.unshift(newComplaint);

  return newComplaint;
};

const realCreateComplaint = async (payload) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/complaints", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return res.json();
};

export const createComplaint = async (payload) => {
  return USE_MOCK
    ? mockCreateComplaint(payload)
    : realCreateComplaint(payload);
};

/* ======================================================
   ACCEPT COMPLAINT → CREATE TASK
====================================================== */

const mockAcceptComplaint = async (complaintId, workerId) => {
  await delay();

  const complaint = COMPLAINTS.find(c => c._id === complaintId);
  if (!complaint) throw new Error("Complaint not found");

  const existingTask = TASKS.find(t => t.complaintId === complaintId);
  if (existingTask) throw new Error("Already assigned");

  const newTask = {
    _id: `task${Date.now()}`,
    complaintId,
    workerId,
    status: "accepted",
    acceptedAt: new Date(),
    proofImages: [],
    notes: ""
  };

  TASKS.push(newTask);

  return newTask;
};

const realAcceptComplaint = async (complaintId, workerId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/complaints/${complaintId}/accept`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ workerId })
    }
  );

  return res.json();
};

export const acceptComplaint = async (complaintId, workerId) => {
  return USE_MOCK
    ? mockAcceptComplaint(complaintId, workerId)
    : realAcceptComplaint(complaintId, workerId);
};

/* ======================================================
   UPDATE TASK STATUS
====================================================== */

const mockUpdateTaskStatus = async (taskId, status, extra = {}) => {
  await delay();

  const task = TASKS.find(t => t._id === taskId);
  if (!task) throw new Error("Task not found");

  task.status = status;

  if (status === "in-progress") {
    task.startedAt = new Date();
  }

  if (status === "completed") {
    task.completedAt = new Date();
    task.proofImages = extra.images || [];
    task.notes = extra.notes || "";

    // 🔥 update complaint
    const complaint = COMPLAINTS.find(c => c._id === task.complaintId);
    if (complaint) complaint.status = "completed";
  }

  if (status === "incompleted") {
    task.notes = extra.notes || "";

    const complaint = COMPLAINTS.find(c => c._id === task.complaintId);
    if (complaint) complaint.status = "incompleted";
  }

  return task;
};

const realUpdateTaskStatus = async (taskId, status, extra = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/tasks/${taskId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, ...extra })
    }
  );

  return res.json();
};

export const updateTaskStatus = async (taskId, status, extra = {}) => {
  return USE_MOCK
    ? mockUpdateTaskStatus(taskId, status, extra)
    : realUpdateTaskStatus(taskId, status, extra);
};