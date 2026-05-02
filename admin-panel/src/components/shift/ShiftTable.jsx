// src/components/shift/ShiftTable.jsx

import { DAYS, SHIFTS } from "../../data/shiftData";
import { workerColor } from "../../utils/workerColor";
import ShiftSelector from "./ShiftSelector";

const T = {
  white: "#FFFFFF",
  g50: "#F8FAFC",
  g100: "#F1F5F9",
  g200: "#E2E8F0",
  g400: "#94A3B8",
  g800: "#1E293B",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  ffHead: "'Syne','Segoe UI',sans-serif",
};

export default function ShiftTable({ workers, schedule, onShiftChange }) {

  const getCount = (day, shiftId) =>
    workers.filter(w => schedule[w._id]?.[day] === shiftId).length;

  return (
    <div style={{ overflowX: "auto", overflowY: "visible" }}>
      <div style={{ minWidth: "700px" }}>

        {/* ── Schedule grid ── */}
        <div style={{
          background: T.white,
          borderRadius: "14px 14px 0 0",
          border: `1px solid ${T.g200}`,
          borderBottom: "none",
          overflow: "visible", // ✅ FIX
        }}>

          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "200px repeat(7, 1fr)",
            background: T.g50,
            borderBottom: `1px solid ${T.g200}`,
          }}>
            <div style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: T.g400 }}>
              Worker
            </div>

            {DAYS.map(d => (
              <div key={d} style={{ padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "12px", fontWeight: 700, color: T.g800 }}>{d}</div>

                <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "4px" }}>
                  {["morning", "evening", "night"].map(sid => {
                    const cnt = getCount(d, sid);
                    const sh = SHIFTS.find(s => s.id === sid);
                    return cnt > 0 ? (
                      <div key={sid} style={{
                        width: "16px",
                        height: "4px",
                        borderRadius: "2px",
                        background: sh.dot,
                      }} />
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {workers.map((w, wi) => {
            const clr = workerColor(w._id);

            return (
              <div key={w._id} style={{
                display: "grid",
                gridTemplateColumns: "200px repeat(7, 1fr)",
                borderBottom: wi < workers.length - 1 ? `1px solid ${T.g100}` : "none",
              }}>
                {/* Worker */}
                <div style={{
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "9px",
                    background: clr,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}>
                    {w.name?.slice(0,2).toUpperCase()}
                  </div>

                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600 }}>{w.name}</div>
                    <div style={{ fontSize: "10px", color: T.g400 }}>{w._id}</div>
                  </div>
                </div>

                {/* Days */}
                {DAYS.map(d => (
                  <div key={d} style={{
                    padding: "8px 4px",
                    display: "flex",
                    justifyContent: "center",
                  }}>
                    <ShiftSelector
                      value={schedule[w._id]?.[d] || "off"}
                      onChange={val => onShiftChange(w._id, d, val)}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}