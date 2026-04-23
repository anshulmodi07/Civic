// src/components/workers/WorkerToolbar.jsx

import { T } from "../../data/workersData";
import WorkerIcon from "./WorkerIcon";

export default function WorkerToolbar({
  search, onSearch,
  shiftFilter, onShiftFilter,
  viewMode, onViewMode,
  total, filteredCount,
}) {
  return (
    <div style={{
      background: T.white,
      borderRadius: "14px",
      border: `1px solid ${T.g200}`,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "16px",
      flexWrap: "wrap",
      boxShadow: "0 2px 6px rgba(0,0,0,0.04)", // ✨ subtle depth
    }}>

      {/* 🔍 Search */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: T.g50,
        border: `1px solid ${T.g200}`,
        borderRadius: "9px",
        padding: "8px 12px",
        flex: "1 1 220px",
        minWidth: "160px",
        transition: "border 0.15s",
      }}>
        <WorkerIcon n="search" sz={14} c={T.g400} />

        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search by name, ID or role…"
          style={{
            background: "none",
            border: "none",
            outline: "none",
            fontSize: "13px",
            color: T.g700,
            width: "100%",
            fontFamily: T.ff,
          }}
        />

        {/* ❌ Clear button (UX upgrade) */}
        {search && (
          <button
            onClick={() => onSearch("")}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: T.g400,
            }}
          >
            <WorkerIcon n="x" sz={12} />
          </button>
        )}
      </div>

      {/* 🕒 Shift filter */}
      <div style={{ display: "flex", gap: "4px" }}>
        {["All", "Morning", "Evening", "Night"].map(f => {
          const active = shiftFilter === f;

          return (
            <button
              key={f}
              onClick={() => onShiftFilter(f)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                border: active ? `1px solid ${T.blue}` : "none",
                fontFamily: T.ff,
                background: active ? T.blueLt : "transparent",
                color: active ? T.blue : T.g500,
                transition: "all 0.15s ease",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* 📊 View toggle */}
      <div style={{
        display: "flex",
        gap: "2px",
        background: T.g50,
        border: `1px solid ${T.g200}`,
        borderRadius: "9px",
        padding: "3px",
      }}>
        {[["grid", "grid"], ["list", "list"]].map(([mode, icon]) => {
          const active = viewMode === mode;

          return (
            <button
              key={mode}
              onClick={() => onViewMode(mode)}
              style={{
                width: "32px",
                height: "30px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? T.white : "transparent",
                boxShadow: active
                  ? "0 2px 6px rgba(0,0,0,0.1)"
                  : "none",
                transition: "all 0.15s ease",
              }}
            >
              <WorkerIcon
                n={icon}
                sz={14}
                c={active ? T.blue : T.g400}
              />
            </button>
          );
        })}
      </div>

      {/* 🔢 Count */}
      <span style={{
        fontSize: "12px",
        color: T.g400,
        whiteSpace: "nowrap",
        fontWeight: 500,
      }}>
        {filteredCount} of {total} workers
      </span>
    </div>
  );
}