// src/components/workers/WorkerProgressBar.jsx

import { T } from "../../data/workersData";

export default function WorkerProgressBar({ done, total,clr }) {
  const pct = Math.round((done / total) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "11px", color: T.g500 }}>Tasks completed</span>
        <span style={{ fontSize: "11px", fontWeight: 700, color: T.g800 }}>{done}/{total}</span>
      </div>
      <div style={{ height: "5px", background: T.g100, borderRadius: "999px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: clr, borderRadius: "999px",
          transition: "width 0.5s ease",
        }} />
      </div>
      <div style={{ fontSize: "10px", color: T.g400, marginTop: "3px", textAlign: "right" }}>
        {pct}%
      </div>
    </div>
  );
}