// src/components/shift/ShiftStatsBar.jsx

import { SHIFTS } from "../../data/shiftData";
import { useMemo } from "react";

const T = {
  white: "#FFFFFF",
  g100: "#F1F5F9",
  g200: "#E2E8F0",
  g400: "#94A3B8",
  g900: "#0F172A",
  ffHead: "'Syne','Segoe UI',sans-serif",
};

export default function ShiftStatsBar({ workers = [], schedule = {} }) {

  // ✅ Pre-calc once (performance + clean)
  const stats = useMemo(() => {
    const totalSlots = workers.length * 7;

    return SHIFTS
      .filter(s => s.id !== "off")
      .map(s => {
        const count = workers.reduce((acc, w) => {
          const workerSchedule = schedule[w._id] || {};

          const shiftCount = Object.values(workerSchedule)
            .filter(v => v === s.id).length;

          return acc + shiftCount;
        }, 0);

        const pct =
          totalSlots > 0
            ? Math.round((count / totalSlots) * 100)
            : 0;

        return { ...s, count, pct };
      });

  }, [workers, schedule]);

  return (
    <div
      style={{
        marginTop: "16px",
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0,1fr))",
        gap: "12px",
      }}
    >
      {stats.map((s) => (
        <div
          key={s.id}
          style={{
            background: T.white,
            borderRadius: "14px",
            border: `1px solid ${T.g200}`,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: s.bg,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              border: s.id === "night" ? "1px solid #334155" : "none",
            }}
          >
            {s.icon}
          </div>

          {/* Stats */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: T.g900,
                  fontFamily: T.ffHead,
                }}
              >
                {s.label}
              </span>

              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: s.clr,
                  fontFamily: T.ffHead,
                }}
              >
                {s.count}
              </span>
            </div>

            <div
              style={{
                fontSize: "11px",
                color: T.g400,
                marginBottom: "6px",
              }}
            >
              {s.time}
            </div>

            {/* Progress */}
            <div
              style={{
                height: "4px",
                background: T.g100,
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${s.pct}%`,
                  background: s.dot,
                  borderRadius: "999px",
                }}
              />
            </div>

            <div
              style={{
                fontSize: "10px",
                color: T.g400,
                marginTop: "3px",
              }}
            >
              {s.pct}% of total slots
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}