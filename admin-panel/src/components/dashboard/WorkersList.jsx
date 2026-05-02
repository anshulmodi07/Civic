// src/components/dashboard/WorkersList.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchWorkers } from "../../api/workerApi";
import { card, chRow, ctTitle, linkBtn, T } from "../../styles/dashboardStyles";
import { SHIFT_S } from "../../data/dashboardData";
import { workerColor } from "../../utils/workerColor";

// ─── Get current shift based on time ─────────────────────────
const getCurrentShift = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 14) return "morning";
  if (hour >= 14 && hour < 22) return "evening";
  return "night";
};

// ─── Skeleton loader ─────────────────────────────────────────
function SkeletonRow() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "12px",
      padding: "12px 20px", borderBottom: `1px solid ${T.g100}`
    }}>
      <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: T.g200 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: "12px", background: T.g200, width: "60%", marginBottom: "6px" }} />
        <div style={{ height: "10px", background: T.g100, width: "40%" }} />
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────
export default function WorkersList() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const deptId = user?.departmentId;

  const loadWorkers = async () => {
    setLoading(true);
    try {
      const data = await fetchWorkers(deptId);
      setWorkers(data || []);
    } catch (err) {
      console.error("Worker fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deptId) loadWorkers();
  }, [deptId]);

  // ✅ Current shift logic
  const currentShift = getCurrentShift();

  // ✅ Only show ON-SHIFT workers
  const onShiftWorkers = workers.filter(
    (w) => w.currentShift === currentShift
  );

  return (
    <div style={card}>
      {/* Header */}
      <div style={chRow}>
        <span style={ctTitle}>On-Shift Workers</span>
        <Link to="/admin/workers">
          <button style={linkBtn}>Manage →</button>
        </Link>
      </div>

      {/* Loading */}
      {loading && [1, 2, 3].map((i) => <SkeletonRow key={i} />)}

      {/* Workers */}
      {!loading && onShiftWorkers.map((w, i) => {
        const clr = workerColor(w._id);

        const completed = w.totalTasks - w.remainingTasks;

        return (
          <div
            key={w._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 20px",
              borderBottom:
                i < onShiftWorkers.length - 1
                  ? `1px solid ${T.g100}`
                  : "none",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: clr,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "12px",
              }}
            >
              {w.name?.slice(0, 2).toUpperCase()}
            </div>

            {/* Name + role */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: T.g800,
                }}
              >
                {w.name}
              </div>
              <div style={{ fontSize: "11px", color: T.g400 }}>
                {w.position}
              </div>
            </div>

            {/* Shift */}
            <span
              style={{
                ...SHIFT_S[w.currentShift],
                fontSize: "13px",
                fontWeight: 600,
                padding: "3px 15px",
                borderRadius: "999px",
              }}
            >
              {w.currentShift}
            </span>

            {/* Tasks */}
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: T.g500,
                minWidth: "50px",
                textAlign: "right",
              }}
            >
              {completed}/{w.totalTasks}
            </span>
          </div>
        );
      })}

      {/* Empty */}
      {!loading && onShiftWorkers.length === 0 && (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: T.g400,
            fontSize: "13px",
          }}
        >
          No workers on current shift
        </div>
      )}
    </div>
  );
}