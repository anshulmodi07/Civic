// src/components/complaints/ComplaintStatusBadge.jsx

/* ─────────────────────────────────────────────
   Complaint Status (DB aligned)
   DB: new | assigned | in-progress | closed
───────────────────────────────────────────── */

const C_STATUS = {
  new:         { label: "New",          cls: "csb csb-pending" },
  assigned:    { label: "Assigned",     cls: "csb csb-assigned" },
  "in-progress": { label: "In Progress", cls: "csb csb-inprogress" },
  closed:      { label: "Closed",       cls: "csb csb-completed" },
};

export function ComplaintStatusBadge({ status }) {
  const m = C_STATUS[status] ?? { label: status, cls: "csb" };

  return (
    <span className={m.cls}>
      <span className="csb-dot" />
      {m.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Task Status (DB aligned)
   DB: assigned | accepted | in-progress | completed | incomplete
───────────────────────────────────────────── */

const T_STATUS = {
  unassigned:    { label: "Unassigned",    cls: "csb csb-unassigned" },
  assigned:      { label: "Assigned",      cls: "csb csb-assigned" },
  accepted:      { label: "Accepted",      cls: "csb csb-accepted" },
  "in-progress": { label: "In Progress",   cls: "csb csb-inprogress" },
  completed:     { label: "Completed",     cls: "csb csb-completed" },
  incomplete:    { label: "Incomplete",    cls: "csb csb-incompleted" },
};

export function TaskStatusBadge({ status }) {
  const key = status ?? "unassigned";
  const m = T_STATUS[key] ?? { label: key, cls: "csb" };

  return (
    <span className={m.cls}>
      <span className="csb-dot" />
      {m.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Type Badge (same as before)
───────────────────────────────────────────── */

export function TypeBadge({ type, visibility }) {
  if (type === "campus") {
    return <span className="csb csb-campus">Campus</span>;
  }

  if (visibility === "private") {
    return <span className="csb csb-private">Hostel · Private</span>;
  }

  return <span className="csb csb-hostel">Hostel · Public</span>;
}