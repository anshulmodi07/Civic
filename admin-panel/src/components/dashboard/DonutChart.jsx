// src/components/dashboard/DonutChart.jsx

import { useEffect, useState } from "react";
import { getComplaints } from "../../api/dashboardApi";
import { T } from "../../styles/dashboardStyles";

export default function DonutChart() {
  const r = 52, cx = 68, cy = 68, C = 2 * Math.PI * r;

  const [data, setData] = useState({
    resolved: 0,
    inProgress: 0,
    pending: 0,
    total: 0
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const deptId = user?.departmentId;

  useEffect(() => {
    loadData();
  }, [deptId]);

  const loadData = async () => {
  try {
    const complaints = await getComplaints(deptId);

    // ✅ Completed (final)
    const resolved = complaints.filter(
      c => c.status === "completed"
    ).length;

    // ✅ In Progress (from TASK)
    const inProgress = complaints.filter(
      c => c.task?.status === "accepted" ||
           c.task?.status === "in-progress"
    ).length;

    // ✅ Pending (no task yet)
    const pending = complaints.filter(
      c => c.status === "pending" && !c.task
    ).length;

    const total = complaints.length;

    setData({ resolved, inProgress, pending, total });

  } catch (err) {
    console.error("DonutChart error:", err);
  }
};

  // 🔥 Avoid divide by 0
  const total = data.total || 1;

  const slices = [
    {
      pct: Math.round((data.resolved / total) * 100),
      clr: "#059669",
      label: "Resolved",
      val: data.resolved
    },
    {
      pct: Math.round((data.inProgress / total) * 100),
      clr: "#2563EB",
      label: "In Progress",
      val: data.inProgress
    },
    {
      pct: Math.round((data.pending / total) * 100),
      clr: "#D97706",
      label: "Pending",
      val: data.pending
    }
  ];

  // 🔥 Build arcs
  let off = 0;
  const arcs = slices.map(s => {
    const len = (s.pct / 100) * C;
    const a = {
      ...s,
      da: `${len - 4} ${C - (len - 4)}`,
      off: -off
    };
    off += len;
    return a;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px" }}>

      {/* Chart */}
      <svg width="136" height="136" viewBox="0 0 136 136">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth="14" />

        {arcs.map((a, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={a.clr}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={a.da}
            strokeDashoffset={a.off}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: `${cx}px ${cy}px`
            }}
          />
        ))}

        <text x={cx} y={cy - 6} textAnchor="middle"
          fontSize="20" fontWeight="800"
          fontFamily="Syne,sans-serif" fill="#0F172A">
          {data.total}
        </text>

        <text x={cx} y={cy + 12} textAnchor="middle"
          fontSize="11" fill="#94A3B8"
          fontFamily="Manrope,sans-serif">
          Total
        </text>
      </svg>

      {/* Legend */}
      <div style={{ width: "100%", marginTop: "16px" }}>
        {slices.map(s => (
          <div key={s.label} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "9px"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: s.clr
            }} />
            <span style={{ fontSize: "12px", color: T.g600, flex: 1 }}>
              {s.label}
            </span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: T.g800 }}>
              {s.val}
            </span>
            <span style={{ fontSize: "11px", color: T.g400 }}>
              {s.pct}%
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}