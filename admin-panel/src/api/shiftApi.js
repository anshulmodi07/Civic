// src/api/shiftApi.js

import { SHIFT_HISTORY } from "../mock/shift";

const USE_MOCK = true;

// helper → convert date → day (Mon, Tue...)
const getDayFromDate = (dateStr) => {
  const d = new Date(dateStr);
  return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
};

// =============================
// GET WEEK SCHEDULE
// =============================
const mockGetSchedule = async (weekStart) => {
  await new Promise(res => setTimeout(res, 200));

  const schedule = {};

  SHIFT_HISTORY.forEach(entry => {
    const day = getDayFromDate(entry.date);

    if (!schedule[entry.workerId]) {
      schedule[entry.workerId] = {};
    }

    schedule[entry.workerId][day] = entry.shift;
  });

  return schedule;
};

// =============================
// SAVE SCHEDULE
// =============================
const mockSaveSchedule = async (schedule) => {
  console.log("Saving schedule →", schedule);

  // 🔥 simulate DB update
  Object.keys(schedule).forEach(workerId => {
    Object.entries(schedule[workerId]).forEach(([day, shift]) => {
      SHIFT_HISTORY.push({
        workerId,
        date: day, // simplified (you can map to real date later)
        shift,
      });
    });
  });

  return { success: true };
};

// =============================
// REAL API (future)
// =============================
const realGetSchedule = async () => {
  const res = await fetch("/api/shifts");
  return res.json();
};

const realSaveSchedule = async (schedule) => {
  const res = await fetch("/api/shifts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });
  return res.json();
};

// =============================
// EXPORTS
// =============================
export const getSchedule = async (weekStart) => {
  return USE_MOCK
    ? mockGetSchedule(weekStart)
    : realGetSchedule(weekStart);
};

export const saveSchedule = async (schedule) => {
  return USE_MOCK
    ? mockSaveSchedule(schedule)
    : realSaveSchedule(schedule);
};