// src/components/complaints/ComplaintTable.jsx

import { useState, useEffect } from "react";
import ComplaintRow from "./ComplaintRow";
import "./complaints.css";

const COLS = [
  { key: "id",       label: "Complaint ID", w: 90 },
  { key: "desc",     label: "Description",  w: null },
  { key: "location", label: "Location",     w: 155 },
  { key: "date",     label: "Filed On",     w: 100 },
  { key: "votes",    label: "Votes",        w: 90 },
  { key: "status",   label: "Status",       w: 120 },
  { key: "task",     label: "Task",         w: 120 },
  { key: "worker",   label: "Worker",       w: 148 },
  { key: "expand",   label: "",             w: 38 },
];

export default function ComplaintTable({ complaints = [], isLoading }) {

  const [expandedId, setExpandedId] = useState(null);

  const toggle = id => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // 🔥 FIX: collapse if data changes
  useEffect(() => {
    setExpandedId(null);
  }, [complaints]);

  // ── LOADING ─────────────────────────
  if (isLoading) {
    return (
      <div className="ctable-state">
        <div className="ctable-spinner" />
        <span>Loading complaints…</span>
      </div>
    );
  }

  // ── EMPTY ───────────────────────────
  if (!complaints || complaints.length === 0) {
    return (
      <div className="ctable-state">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#C4C8DC" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>

        <div className="ctable-empty-title">
          No complaints found
        </div>

        <div className="ctable-empty-sub">
          Try changing your filters or search term.
        </div>
      </div>
    );
  }

  // ── TABLE ───────────────────────────
  return (
    <div className="ctable-wrap">
      <table className="ctable">

        <colgroup>
          {COLS.map(c => (
            <col key={c.key} style={c.w ? { width: c.w } : {}} />
          ))}
        </colgroup>

        <thead>
          <tr className="ctable-head">
            {COLS.map(c => (
              <th key={c.key} className="ctable-th">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {complaints.map((complaint) => (
            <ComplaintRow
              key={complaint._id}
              complaint={complaint}
              isExpanded={expandedId === complaint._id}
              onToggle={() => toggle(complaint._id)}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
}