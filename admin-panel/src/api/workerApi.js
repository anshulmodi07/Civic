// 🔥 toggle when backend is ready
const USE_MOCK = true;

import { WORKERS } from "../mock/workers1";

// ==========================
// GET CURRENT SHIFT BASED ON TIME
// ==========================
const getCurrentShift = () => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 14) return "morning";
  if (hour >= 14 && hour < 22) return "evening";
  return "night"; // 10 PM – 6 AM
};

// ==========================
// FETCH WORKERS
// ==========================
export const fetchWorkers = async (departmentId) => {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 300));

    return WORKERS.filter(
      (w) => w.departmentId === departmentId
    );
  }

  const res = await fetch(`/api/workers?departmentId=${departmentId}`);
  const data = await res.json();
  return data;
};

// ==========================
// FETCH WORKER STATS (UPDATED)
// ==========================
export const fetchWorkerStats = async (departmentId) => {
  const workers = await fetchWorkers(departmentId);

  const total = workers.length;

  const currentShift = getCurrentShift();

  // ✅ ACTIVE = workers in current shift
  const active = workers.filter(
    (w) => w.currentShift === currentShift
  ).length;

  // ✅ OFF DUTY = rest
  const offDuty = total - active;

  return {
    total,
    active,
    offDuty,
    currentShift
  };
};