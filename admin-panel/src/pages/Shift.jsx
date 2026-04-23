// src/pages/Shift.jsx

import { useState, useEffect } from "react";
import { fetchWorkers } from "../api/workerApi";
import { getSchedule, saveSchedule } from "../api/shiftApi";

import ShiftHeader from "../components/shift/ShiftHeader";
import ShiftLegend from "../components/shift/ShiftLegend";
import ShiftTable from "../components/shift/ShiftTable";
import ShiftStatsBar from "../components/shift/ShiftStatsBar";

const T = {
  g50: "#F8FAFC",
  blueMd: "#BFDBFE",
  blue: "#2563EB",
  ff: "'Manrope','Segoe UI',sans-serif",
};

export default function Shift() {
  const [workers, setWorkers] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [saved, setSaved] = useState(false);

  const weekLabel = "Apr 7 – Apr 13, 2026";

  // 🔥 LOAD REAL DATA (workers + schedule)
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const dept = user?.departmentId || user?.department;

        const workersData = await fetchWorkers(dept);
        setWorkers(workersData);

        // ✅ GET schedule from API (mock/db)
        const scheduleData = await getSchedule();
        setSchedule(scheduleData);

      } catch (err) {
        console.error("Shift load error:", err);
      }
    };

    loadData();
  }, []);

  // ── Handlers ─────────────────────────

  const handleShiftChange = (workerId, day, shiftId) => {
    setSchedule(prev => ({
      ...prev,
      [workerId]: {
        ...prev[workerId],
        [day]: shiftId,
      },
    }));
    setSaved(false);
  };

  // ✅ SAVE TO API
  const handleSave = async () => {
    try {
      await saveSchedule(schedule);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ✅ RESET FROM API
  const handleReset = async () => {
    try {
      const scheduleData = await getSchedule();
      setSchedule(scheduleData);
      setSaved(false);
    } catch (err) {
      console.error("Reset error:", err);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        background: T.g50,
        minHeight: "100%",
        fontFamily: T.ff,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <ShiftHeader
        weekLabel={weekLabel}
        saved={saved}
        onSave={handleSave}
        onReset={handleReset}
      />

      {/* Legend */}
      <ShiftLegend />

      {/* Table */}
      <ShiftTable
        workers={workers}
        schedule={schedule}
        onShiftChange={handleShiftChange}
      />

      {/* Stats */}
      <ShiftStatsBar
        workers={workers}
        schedule={schedule}
      />

      {/* Info */}
      <div
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          borderRadius: "10px",
          background: "#EFF6FF",
          border: `1px solid ${T.blueMd}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke={T.blue}
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>

        <span style={{ fontSize: "12px", color: "#1D4ED8" }}>
          Click any shift cell to change a worker's shift for that day.
          Press <strong>Save Schedule</strong> to confirm all changes.
        </span>
      </div>
    </div>
  );
}