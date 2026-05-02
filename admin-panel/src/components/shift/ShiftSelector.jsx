// src/components/shift/ShiftSelector.jsx

import { useState, useRef } from "react";
import { SHIFTS } from "../../data/shiftData";
import ShiftIcon from "./ShiftIcon";

const T = {
  white: "#FFFFFF",
  g50: "#F8FAFC",
  g200: "#E2E8F0",
  g400: "#94A3B8",
  g700: "#334155",
  g800: "#1E293B",
  blue: "#2563EB",
  ff: "'Manrope','Segoe UI',sans-serif",
};

export default function ShiftSelector({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const btnRef = useRef();

  const current = SHIFTS.find(s => s.id === value) || SHIFTS[3];

  const handleOpen = () => {
    const rect = btnRef.current.getBoundingClientRect();

    setPos({
      top: rect.bottom + 6,
      left: rect.left + rect.width / 2,
    });

    setOpen(v => !v);
  };

  return (
    <>
      {/* Button */}
      <div style={{ position: "relative" }}>
        <button
          ref={btnRef}
          onClick={handleOpen}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            padding: "4px 8px",
            borderRadius: "8px",
            background: current.bg,
            color: current.clr,
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
            width: "100%",
            justifyContent: "center",
          }}
        >
          {current.icon} {current.label}
          <ShiftIcon n="chevD" sz={10} c={current.clr} />
        </button>
      </div>

      {/* Dropdown (FIXED POSITION) */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
            }}
          />

          {/* Menu */}
          <div
            style={{
              position: "fixed", // ✅ KEY FIX
              top: pos.top,
              left: pos.left,
              transform: "translateX(-50%)",
              background: T.white,
              border: `1px solid ${T.g200}`,
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              zIndex: 1000,
              minWidth: "160px",
            }}
          >
            {SHIFTS.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  width: "100%",
                  border: "none",
                  background: value === s.id ? T.g50 : T.white,
                  cursor: "pointer",
                  fontSize: "12px",
                  textAlign: "left",
                }}
              >
                {s.icon}
                <span>{s.label}</span>

                {value === s.id && (
                  <ShiftIcon n="check" sz={12} c={T.blue} />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}