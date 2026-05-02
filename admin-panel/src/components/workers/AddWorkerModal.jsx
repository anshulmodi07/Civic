// src/components/workers/AddWorkerModal.jsx

import { useState } from "react";
import { T, SHIFT_S } from "../../data/workersData";
import WorkerIcon from "./WorkerIcon";

export default function AddWorkerModal({ onClose, onAdd }) {
  const [activeShift, setActiveShift] = useState("Morning");

  // ✅ DB-aligned state
  const [form, setForm] = useState({
    name: "",
    workerId: "", // temporary UI field
    position: "",
    phoneNumber: "",
    email: "",
  });

  // ✅ handle input change
  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // ✅ submit handler
  const handleSubmit = () => {
    const payload = {
      name: form.name,
      email: form.email,
      phoneNumber: form.phoneNumber,
      position: form.position,
      currentShift: activeShift.toLowerCase(), // DB format
      totalTasks: 0,
      remainingTasks: 0,
    };

    console.log("NEW WORKER:", payload);

    if (onAdd) onAdd(payload);
    onClose();
  };

  return (
    <>
      <style>{`@keyframes wPopIn { from { transform: translate(-50%,-50%) scale(0.95); opacity:0; } to { transform: translate(-50%,-50%) scale(1); opacity:1; } }`}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 80,
        background: "rgba(15,23,42,0.4)", backdropFilter: "blur(3px)",
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: T.white, borderRadius: "20px",
        width: "460px", zIndex: 90,
        boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
        overflow: "hidden", animation: "wPopIn 0.25s ease",
      }}>

        {/* Header */}
        <div style={{
          padding: "20px 24px", background: T.g50,
          borderBottom: `1px solid ${T.g100}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: T.g900, fontFamily: T.ffHead }}>
              Add New Worker
            </div>
            <div style={{ fontSize: "12px", color: T.g400, marginTop: "2px" }}>
              Fill in the worker details below
            </div>
          </div>

          <button onClick={onClose} style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: T.white, border: `1px solid ${T.g200}`,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <WorkerIcon n="x" sz={14} c={T.g500} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: "20px 24px" }}>

          {/* Name */}
          <Input label="Full Name" value={form.name}
            onChange={v => handleChange("name", v)} placeholder="e.g. Ramesh Kumar" />

          {/* Worker ID (UI only) */}
          <Input label="Worker ID"
            value={form.workerId}
            onChange={v => handleChange("workerId", v)}
            placeholder="Auto-generated (optional)" />

          {/* Position */}
          <Input label="Role / Type"
            value={form.position}
            onChange={v => handleChange("position", v)}
            placeholder="e.g. Sr. Electrician" />

          {/* Phone */}
          <Input label="Phone"
            value={form.phoneNumber}
            onChange={v => handleChange("phoneNumber", v)}
            placeholder="+91 XXXXX XXXXX" />

          {/* Email */}
          <Input label="Email"
            value={form.email}
            onChange={v => handleChange("email", v)}
            placeholder="worker@civic.com" />

          {/* Shift */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{
              display: "block", fontSize: "12px", fontWeight: 600,
              color: T.g700, marginBottom: "8px"
            }}>
              Shift
            </label>

            <div style={{ display: "flex", gap: "8px" }}>
              {["Morning", "Evening", "Night"].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveShift(s)}
                  style={{
                    flex: 1,
                    padding: "9px",
                    borderRadius: "9px",
                    cursor: "pointer",
                    fontFamily: T.ff,
                    fontSize: "12px",
                    fontWeight: 600,
                    border: `1.5px solid ${
                      activeShift === s ? SHIFT_S[s].color : T.g200
                    }`,
                    ...SHIFT_S[s],
                    opacity: activeShift === s ? 1 : 0.6,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} style={{
            width: "100%",
            padding: "12px",
            borderRadius: "11px",
            background: T.blue,
            color: "#fff",
            border: "none",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: T.ff,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}>
            <WorkerIcon n="check" sz={15} c="#fff" /> Add Worker
          </button>
        </div>
      </div>
    </>
  );
}

/* 🔹 Reusable input (UI unchanged) */
function Input({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={{
        display: "block",
        fontSize: "12px",
        fontWeight: 600,
        color: T.g700,
        marginBottom: "6px"
      }}>
        {label}
      </label>

      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          border: `1px solid ${T.g200}`,
          borderRadius: "10px",
          fontSize: "13px",
          color: T.g800,
          background: T.g50,
          outline: "none",
          fontFamily: T.ff,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}