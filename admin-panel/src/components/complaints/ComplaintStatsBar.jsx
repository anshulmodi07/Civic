// src/components/complaints/ComplaintStatsBar.jsx
import "./complaints.css";

/* ───────────────── ICONS ───────────────── */

const IcoTotal = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IcoPending = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 7 12 12 15 15"/>
  </svg>
);

const IcoDone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IcoFail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const IcoUnassigned = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

/* ───────────────── MAIN ───────────────── */

export default function ComplaintStatsBar({ complaints }) {

  const total = complaints.length;

  // ✅ Complaint status (final outcome)
  const pending = complaints.filter(c => c.status === "pending").length;

  const completed = complaints.filter(c => c.status === "completed").length;

  const failed = complaints.filter(c => c.status === "incompleted").length;

  // ✅ Task-based progress
  const inProgress = complaints.filter(
    c => c.task?.status === "accepted" || c.task?.status === "in-progress"
  ).length;

  // ✅ No task = not accepted yet
  const unassigned = complaints.filter(c => !c.task).length;

  // ✅ votes (optional)
  const totalVotes = complaints.reduce(
    (sum, c) => sum + (c.supporters?.length ?? 0),
    0
  );

  const hostel = complaints.filter(c => c.type === "hostel").length;
  const campus = complaints.filter(c => c.type === "campus").length;

  const pct = v => total > 0 ? `${Math.round((v / total) * 100)}%` : "0%";

  const CARDS = [
    {
      label: "Total",
      value: total,
      icon: <IcoTotal />,
      icoBg: "#F4F6FA",
      icoClr: "#8A90A8",
      tag: `${hostel} hostel · ${campus} campus`,
      tagCls: "nt",
    },
    {
      label: "Pending",
      value: pending,
      icon: <IcoPending />,
      icoBg: "#FEF3DC",
      icoClr: "#B07A10",
      tag: `${pct(pending)} new`,
      tagCls: "am",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: <IcoPending />,
      icoBg: "#EAF0FB",
      icoClr: "#1A4DB8",
      tag: `${pct(inProgress)} active`,
      tagCls: "bl",
    },
    {
      label: "Completed",
      value: completed,
      icon: <IcoDone />,
      icoBg: "#E8F5EC",
      icoClr: "#1A6B3A",
      tag: `${pct(completed)} resolved`,
      tagCls: "gn",
    },

    {
      label: "Unassigned",
      value: unassigned,
      icon: <IcoUnassigned />,
      icoBg: "#EAF0FB",
      icoClr: "#1A4DB8",
      tag: unassigned > 0 ? "needs worker" : "all assigned",
      tagCls: "bl",
    },
  ];

  return (
    <div className="csbar-row">
      {CARDS.map(c => (
        <div key={c.label} className="csbar-card">
          <div className="csbar-top">
            <div>
              <div className="csbar-lbl">{c.label}</div>
              <div className="csbar-num" style={{ color: c.icoClr }}>
                {c.value}
              </div>
            </div>

            <div
              className="csbar-ico"
              style={{ background: c.icoBg, color: c.icoClr }}
            >
              {c.icon}
            </div>
          </div>

          <div className={`csbar-tag csbar-tag-${c.tagCls}`}>
            {c.tag}
          </div>
        </div>
      ))}
    </div>
  );
}