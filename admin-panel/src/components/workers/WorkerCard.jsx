// src/components/workers/WorkerCard.jsx

import { useState } from "react";
import { T, SHIFT_S } from "../../data/workersData";
import WorkerIcon from "./WorkerIcon";
import WorkerProgressBar from "./WorkerProgressBar";
import { workerColor } from "../../utils/workerColor";

export default function WorkerCard({ w, onSelect, viewMode }) {
  const [hov, setHov] = useState(false);

  // ✅ Derived values
  const clr = workerColor(w._id);
  const done = w.totalTasks - w.remainingTasks;
  const total = w.totalTasks || 0;
  const percent = total ? Math.round((done / total) * 100) : 0;

  // ─── LIST VIEW ─────────────────────────────────────────
  if (viewMode === "list") {
    return (
      <div
        onClick={() => onSelect(w)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "14px 20px",
          background: hov ? T.g50 : T.white,
          borderBottom: `1px solid ${T.g100}`,
          cursor: "pointer",
        }}
      >
        {/* Avatar */}
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: clr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
        }}>
          {w.name?.slice(0, 2).toUpperCase()}
        </div>

        {/* Name */}
        <div style={{ flex: "0 0 200px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600 }}>
            {w.name}
          </div>
          <div style={{ fontSize: "12px", color: T.g400 }}>
            {w.position}
          </div>
        </div>

        {/* ID */}
        <div style={{ flex: "0 0 90px", fontSize: "11px", color: T.g400 }}>
          {w._id}
        </div>

        {/* Shift */}
        <div style={{ flex: "0 0 100px" }}>
          <span style={{
            ...SHIFT_S[w.currentShift],
            padding: "4px 10px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 600
          }}>
            {w.currentShift}
          </span>
        </div>

        {/* Progress */}
        <div style={{ flex: 1 }}>
          <WorkerProgressBar done={done} total={total} clr={clr} />
        </div>

        <WorkerIcon n="chevronR" sz={16} c={hov ? T.blue : T.g300} />
      </div>
    );
  }

  // ─── GRID VIEW ─────────────────────────────────────────
  return (
    <div
      onClick={() => onSelect(w)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.white,
        borderRadius: "18px",
        border: `1px solid ${hov ? T.blueMd : T.g200}`,
        padding: "22px",
        cursor: "pointer",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all 0.2s",
      }}
    >
      {/* Top strip */}
      <div style={{
        height: "3px",
        background: clr,
        borderRadius: "10px",
        marginBottom: "14px"
      }} />

      {/* Avatar + shift */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          borderRadius: "14px",
          background: clr,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 700,
        }}>
          {w.name?.slice(0, 2).toUpperCase()}
        </div>

        <span style={{
          ...SHIFT_S[w.currentShift],
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "11px",
          fontWeight: 600,
          height: "fit-content"
        }}>
          {w.currentShift}
        </span>
      </div>

      {/* Name */}
      <div style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "15px", fontWeight: 700 }}>
          {w.name}
        </div>
        <div style={{ fontSize: "12px", color: T.g400 }}>
          {w.position}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "12px"
      }}>
        <Stat label="Done" val={done} />
        <Stat label="Left" val={w.remainingTasks} />
        <Stat label="Rate" val={`${percent}%`} clr={clr} />
      </div>

      <WorkerProgressBar done={done} total={total} clr={clr} />
    </div>
  );
}

// 🔹 Small stat box
function Stat({ label, val, clr }) {
  return (
    <div style={{
      flex: 1,
      textAlign: "center",
      background: "#F8FAFC",
      borderRadius: "10px",
      padding: "8px"
    }}>
      <div style={{
        fontWeight: 800,
        color: clr || "#0F172A"
      }}>
        {val}
      </div>
      <div style={{
        fontSize: "10px",
        color: "#94A3B8"
      }}>
        {label}
      </div>
    </div>
  );
}