import { useEffect, useState } from "react";
import { getStats } from "../../api/dashboardApi";
import { getUser } from "../../api/auth";
import { fetchWorkers } from "../../api/workerApi";
import { T, card } from "../../styles/dashboardStyles";

// ─── Professional color configs per stat label ────────────────────────────────
const STAT_STYLES = {
  "Total Complaints": {
    accent:    "#2563EB",
    accentLt:  "#EFF6FF",
    accentMd:  "#BFDBFE",
    label:     "Total Complaints",
  },
  "Resolved Today": {
    accent:    "#059669",
    accentLt:  "#ECFDF5",
    accentMd:  "#A7F3D0",
    label:     "Resolved Today",
  },
  "Pending": {
    accent:    "#D97706",
    accentLt:  "#FFFBEB",
    accentMd:  "#FDE68A",
    label:     "Pending",
  },
  "Active Workers": {
    accent:    "#7C3AED",
    accentLt:  "#F5F3FF",
    accentMd:  "#DDD6FE",
    label:     "Active Workers",
  },
};

// Fallback style for unknown stat labels
const DEFAULT_STYLE = {
  accent:   "#0EA5E9",
  accentLt: "#F0F9FF",
  accentMd: "#BAE6FD",
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div style={{
      ...card, padding: "22px 24px",
      animation: "scPulse 1.4s ease-in-out infinite",
    }}>
      <style>{`@keyframes scPulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
      <div style={{ height: "10px", width: "55%", borderRadius: "5px", background: "#E2E8F0", marginBottom: "20px" }} />
      <div style={{ height: "34px", width: "45%", borderRadius: "8px", background: "#E2E8F0", marginBottom: "10px" }} />
      <div style={{ height: "3px", borderRadius: "999px", background: "#F1F5F9", marginBottom: "14px" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ height: "10px", width: "40%", borderRadius: "5px", background: "#F1F5F9" }} />
        <div style={{ height: "10px", width: "20%", borderRadius: "5px", background: "#F1F5F9" }} />
      </div>
    </div>
  );
}

// ─── Single Stat Card ─────────────────────────────────────────────────────────
function StatCard({ s }) {
  const style  = STAT_STYLES[s.label] || DEFAULT_STYLE;
  const isUp   = s.dir === "up";
  const subTag = s.sub?.split(" ")[0] || "";

  // Parse progress bar width from num if possible
  let barWidth = 60;
  if (typeof s.num === "string" && s.num.includes("/")) {
    const [a, b] = s.num.split("/").map(Number);
    if (!isNaN(a) && !isNaN(b) && b > 0) barWidth = Math.round((a / b) * 100);
  } else if (s.barW) {
    barWidth = s.barW;
  }

  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: "16px",
        border: `1px solid ${hov ? style.accentMd : "#E2E8F0"}`,
        padding: "22px 24px",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hov ? `0 4px 20px ${style.accent}14` : "none",
        cursor: "default",
      }}
    >
      {/* Top accent strip */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "3px", background: style.accent,
        borderRadius: "16px 16px 0 0",
        opacity: hov ? 1 : 0.6,
        transition: "opacity 0.2s",
      }} />

      {/* Label + change badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{
          fontSize: "11px", fontWeight: 700, color: "#94A3B8",
          textTransform: "uppercase", letterSpacing: "0.07em",
        }}>
          {s.label}
        </span>
        {subTag && (
          <span style={{
            fontSize: "10px", fontWeight: 700,
            padding: "3px 8px", borderRadius: "999px",
            background: isUp ? "#ECFDF5" : "#F1F5F9",
            color:      isUp ? "#059669" : "#64748B",
            letterSpacing: "0.02em",
          }}>
            {subTag}
          </span>
        )}
      </div>

      {/* Big number */}
      <div style={{
        fontFamily: "'Syne','Segoe UI',sans-serif",
        fontSize: "32px", fontWeight: 800,
        color: "#0F172A", lineHeight: 1,
        letterSpacing: "-0.03em", marginBottom: "14px",
      }}>
        {s.num}
      </div>

      {/* Progress bar */}
      <div style={{
        height: "4px", background: "#F1F5F9",
        borderRadius: "999px", overflow: "hidden", marginBottom: "12px",
      }}>
        <div style={{
          height: "100%", width: `${Math.min(barWidth, 100)}%`,
          background: `linear-gradient(90deg, ${style.accent}, ${style.accentMd})`,
          borderRadius: "999px",
          transition: "width 0.6s ease",
        }} />
      </div>

      {/* Sub text */}
      {s.sub && (
        <div style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 400 }}>
          {s.sub}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StatsCards() {
  const [stats,   setStats]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await getUser();
        if (!user) return;

        const deptId = user.departmentId;

        const [statsData, workers] = await Promise.all([
          getStats(deptId),
          fetchWorkers(deptId),
        ]);

        // Calculate active workers
        const activeWorkers = workers.filter(w => w.currentShift !== "off").length;
        const totalWorkers  = workers.length;

        const updated = statsData.map(s =>
          s.label === "Active Workers"
            ? { ...s, num: `${activeWorkers}/${totalWorkers}` }
            : s
        );

        setStats(updated);
      } catch (err) {
        console.error("StatsCards error:", err);
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "18px" }}>
        {[1, 2, 3, 4].map(i => <StatSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "16px 20px", borderRadius: "12px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px", fontWeight: 500, marginBottom: "18px" }}>
        ⚠️ {error}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div style={{ padding: "16px", color: "#94A3B8", fontSize: "13px", marginBottom: "18px" }}>
        No stats available.
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "14px",
      marginBottom: "18px",
    }}>
      {stats.map(s => <StatCard key={s.label} s={s} />)}
    </div>
  );
}