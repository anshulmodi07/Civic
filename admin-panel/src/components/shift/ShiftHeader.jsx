// src/components/shift/ShiftHeader.jsx

import ShiftIcon from "./ShiftIcon";

const T = {
  white: "#FFFFFF", g200: "#E2E8F0", g400: "#94A3B8",
  g500: "#64748B", g600: "#475569", g700: "#334155", g900: "#0F172A",
  blue: "#2563EB", green: "#059669",
  ff: "'Manrope','Segoe UI',sans-serif",
  ffHead: "'Syne','Segoe UI',sans-serif",
};

export default function ShiftHeader({ weekLabel, saved, onSave, onReset }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "22px",
      flexWrap: "wrap",
      gap: "12px",
    }}>
      
      {/* Title */}
      <div>
        <h1 style={{
          fontFamily: T.ffHead,
          fontSize: "20px",
          fontWeight: 700,
          color: T.g900,
          margin: 0,
          letterSpacing: "-0.01em",
        }}>
          Shift Management
        </h1>

        {/* 🔥 Sub-label (NEW, helpful but subtle) */}
        <div style={{
          fontSize: "12px",
          color: T.g400,
          marginTop: "4px"
        }}>
          Weekly scheduling & workforce allocation
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

        {/* Week label */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          padding: "8px 14px",
          background: T.white,
          border: `1px solid ${T.g200}`,
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: 600,
          color: T.g700,
          whiteSpace: "nowrap",
        }}>
          <ShiftIcon n="calendar" sz={14} c={T.g500} />
          {weekLabel}
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 16px",
            borderRadius: "10px",
            background: T.white,
            border: `1px solid ${T.g200}`,
            fontSize: "13px",
            fontWeight: 600,
            color: T.g600,
            cursor: "pointer",
            fontFamily: T.ff,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
          onMouseLeave={e => e.currentTarget.style.background = T.white}
        >
          <ShiftIcon n="reset" sz={14} c={T.g500} />
          Reset
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "9px 20px",
            borderRadius: "10px",
            background: saved ? T.green : T.blue,
            border: "none",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: T.ff,
            transition: "all 0.25s ease",
            boxShadow: `0 4px 14px ${saved ? T.green : T.blue}40`,
          }}
        >
          {saved ? (
            <>
              <ShiftIcon n="check" sz={14} c="#fff" />
              Saved!
            </>
          ) : (
            <>
              <ShiftIcon n="save" sz={14} c="#fff" />
              Save Schedule
            </>
          )}
        </button>
      </div>
    </div>
  );
}