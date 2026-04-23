// src/api/dashboardApi.js

import { COMPLAINTS } from "../mock/complaints1";
import { WORKERS } from "../mock/workers1";

// 🔥 toggle later
const USE_MOCK = true;

// ─────────────────────────────────────────────
// MOCK: COMPLAINTS
// ─────────────────────────────────────────────
const mockComplaints = async (departmentId) => {
  return COMPLAINTS.filter(c => c.departmentId === departmentId);
};

// ─────────────────────────────────────────────
// MOCK: STATS (DB ALIGNED)
// ─────────────────────────────────────────────
const mockStats = async (departmentId) => {
  const STAT_TEMPLATE = [
    {
      key: "total",
      label: "Total Complaints",
      icon: "alert",
      iconBg: "#EFF6FF",
      iconClr: "#2563EB",
      barClr: "#2563EB"
    },
    {
      key: "resolved",
      label: "Resolved",
      icon: "check",
      iconBg: "#ECFDF5",
      iconClr: "#059669",
      barClr: "#059669"
    },
    {
      key: "pending",
      label: "Pending",
      icon: "clock",
      iconBg: "#FFFBEB",
      iconClr: "#D97706",
      barClr: "#D97706"
    },
    {
      key: "workers",
      label: "Active Workers",
      icon: "users",
      iconBg: "#F5F3FF",
      iconClr: "#7C3AED",
      barClr: "#7C3AED"
    }
  ];

  // ✅ FILTER BY DEPARTMENT (CORRECT FIELD)
  const deptComplaints = COMPLAINTS.filter(
    c => c.departmentId === departmentId
  );

  const deptWorkers = WORKERS.filter(
    w => w.departmentId === departmentId
  );

  // ✅ COUNTS
  const total = deptComplaints.length;

  const resolved = deptComplaints.filter(
    c => c.status === "closed"
  ).length;

  const pending = deptComplaints.filter(
    c => c.status !== "closed"
  ).length;

  // ✅ ACTIVE WORKERS (SHIFT BASED)
  const activeWorkers = deptWorkers.filter(
    w => w.currentShift !== "off"
  ).length;

  // ─────────────────────────────────────────────
  // BUILD RESPONSE
  // ─────────────────────────────────────────────
  return STAT_TEMPLATE.map(stat => {
    switch (stat.key) {
      case "total":
        return {
          ...stat,
          num: total,
          sub: "All complaints",
          dir: "up",
          barW: Math.min(total * 10, 100)
        };

      case "resolved":
        return {
          ...stat,
          num: resolved,
          sub: "Closed",
          dir: "up",
          barW: total ? Math.round((resolved / total) * 100) : 0
        };

      case "pending":
        return {
          ...stat,
          num: pending,
          sub: "Open",
          dir: "flat",
          barW: total ? Math.round((pending / total) * 100) : 0
        };

      case "workers":
        return {
          ...stat,
          num: activeWorkers,
          sub: "On duty",
          dir: "up",
          barW: deptWorkers.length
            ? Math.round((activeWorkers / deptWorkers.length) * 100)
            : 0
        };

      default:
        return stat;
    }
  });
};

// ─────────────────────────────────────────────
// REAL API (BACKEND)
// ─────────────────────────────────────────────
const realStats = async (departmentId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `http://localhost:5000/api/dashboard/stats?departmentId=${departmentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();
  return data.stats;
};

// ─────────────────────────────────────────────
// MAIN STATS
// ─────────────────────────────────────────────
export const getStats = async (departmentId) => {
  return USE_MOCK ? mockStats(departmentId) : realStats(departmentId);
};

// ─────────────────────────────────────────────
// REAL COMPLAINTS
// ─────────────────────────────────────────────
const realComplaints = async (departmentId) => {
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

// ─────────────────────────────────────────────
// MAIN COMPLAINTS
// ─────────────────────────────────────────────
export const getComplaints = async (departmentId) => {
  return USE_MOCK
    ? mockComplaints(departmentId)
    : realComplaints(departmentId);
};