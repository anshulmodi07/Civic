// src/components/workers/WorkerDetailPanel.jsx

import { T, SHIFT_S } from "../../data/workersData";
import WorkerIcon from "./WorkerIcon";
import WorkerProgressBar from "./WorkerProgressBar";
import { workerColor } from "../../utils/workerColor";

export default function WorkerDetailPanel({ worker, onClose }) {
  if (!worker) return null;

  // ✅ DB → UI mapping (NO UI CHANGE)
  const clr = workerColor(worker._id);

  const done = worker.totalTasks - worker.remainingTasks;
  const total = worker.totalTasks || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const contactRows = [
    { icon: "phone", label: "Phone", val: worker.phoneNumber },
    { icon: "mail", label: "Email", val: worker.email },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 80,
          background: "rgba(15,23,42,0.35)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "400px",
          background: T.white,
          zIndex: 90,
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: T.g50,
            borderBottom: `1px solid ${T.g100}`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>
              Worker Profile
            </div>
            <div style={{ fontSize: "12px", color: T.g400 }}>
              Details & performance
            </div>
          </div>

          <button onClick={onClose}>
            <WorkerIcon n="x" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", overflowY: "auto" }}>
          {/* Avatar */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: clr,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "22px",
                fontWeight: 700,
                margin: "0 auto",
              }}
            >
              {worker.name?.slice(0, 2).toUpperCase()}
            </div>

            <div style={{ marginTop: "10px", fontWeight: 700 }}>
              {worker.name}
            </div>

            <div style={{ fontSize: "12px", color: T.g400 }}>
              {worker.position}
            </div>

            {/* Shift */}
            <div style={{ marginTop: "10px" }}>
              <span
                style={{
                  ...SHIFT_S[
                  worker.currentShift?.charAt(0).toUpperCase() +
                  worker.currentShift?.slice(1)
                  ],
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {worker.currentShift}
              </span>
            </div>

            {/* ID */}
            <div
              style={{
                marginTop: "6px",
                fontSize: "11px",
                color: T.g400,
              }}
            >
              {worker._id}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            {[
              { label: "Completed", val: done },
              { label: "Remaining", val: worker.remainingTasks },
              { label: "Success %", val: `${pct}%`, clr },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: T.g50,
                  borderRadius: "10px",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: s.clr || T.g900,
                  }}
                >
                  {s.val}
                </div>
                <div style={{ fontSize: "10px", color: T.g400 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <WorkerProgressBar done={done} total={total} clr={clr} />

          {/* Contact */}
          {/* Contact */}
          <div style={{ marginTop: "22px" }}>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "12px",
                color: T.g700,
                letterSpacing: "0.02em",
              }}
            >
              Contact Details
            </div>

            {contactRows.map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: T.g50,
                  border: `1px solid ${T.g200}`,
                  borderRadius: "12px",
                  padding: "10px 14px",
                  marginBottom: "10px",
                  transition: "all 0.15s ease",
                }}
              >
                {/* Left side */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: `${clr}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <WorkerIcon n={r.icon} c={clr} sz={14} />
                  </div>

                  <div>
                    <div style={{ fontSize: "10px", color: T.g400 }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: T.g800 }}>
                      {r.val || "-"}
                    </div>
                  </div>
                </div>

                {/* Copy icon (optional nice touch) */}
                <button
                  onClick={() => navigator.clipboard.writeText(r.val || "")}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: T.g400,
                  }}
                >
                  <WorkerIcon n="copy" sz={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}