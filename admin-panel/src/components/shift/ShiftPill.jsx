// src/components/shift/ShiftPill.jsx

import { SHIFTS } from "../../data/shiftData";
import { useMemo } from "react";

export default function ShiftPill({ shiftId = "off", small = false }) {

  // 🔥 safer lookup (prevents crashes)
  const s = useMemo(() => {
    return SHIFTS.find(sh => sh.id === shiftId) || SHIFTS.find(sh => sh.id === "off");
  }, [shiftId]);

  return (
    <span
      title={`${s.label} • ${s.time}`} // ✅ tooltip (nice UX)
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: small ? "2px 8px" : "4px 10px",
        borderRadius: "999px",
        background: s.bg,
        color: s.clr,
        fontSize: small ? "10px" : "11px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        border: shiftId === "night" ? "1px solid #334155" : "none",
        transition: "all 0.15s ease",
      }}
    >
      {s.icon} {s.label}
    </span>
  );
}