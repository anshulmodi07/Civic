// src/components/shift/ShiftLegend.jsx

import { SHIFTS } from "../../data/shiftData";

const T = {
  white: "#FFFFFF",
  g200: "#E2E8F0",
  g400: "#94A3B8",
  g800: "#1E293B",
};

export default function ShiftLegend() {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      {(SHIFTS || []).map((s) => (
        <div
          key={s.id}
          title={`${s.label} • ${s.time}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            background: T.white,
            border: `1px solid ${T.g200}`,
            borderRadius: "10px",
            transition: "all 0.15s ease",
            cursor: "default",
          }}
        >
          {/* Dot */}
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: s.dot,
              flexShrink: 0,
              boxShadow: `0 0 0 2px ${s.dot}20`,
            }}
          />

          {/* Text */}
          <div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: T.g800,
              }}
            >
              {s.icon} {s.label}
            </span>

            <span
              style={{
                fontSize: "11px",
                color: T.g400,
                marginLeft: "6px",
              }}
            >
              {s.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}