// src/components/complaints/ComplaintRow.jsx

import { ComplaintStatusBadge, TaskStatusBadge, TypeBadge } from "./ComplaintStatusBadge";
import "./complaints.css";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function VotesBar({ votes }) {
  const pct = Math.min((votes / 40) * 100, 100);

  return (
    <div className="crow-votes">
      <div className="crow-vtrack">
        <div className="crow-vfill" style={{ width: `${pct}%` }} />
      </div>
      <span className="crow-vnum">{votes}</span>
    </div>
  );
}

function LocationCell({ c }) {
  if (c.type === "campus") {
    return (
      <div className="crow-loc">
        <div className="crow-loc-p">{c.area}</div>
        <div className="crow-loc-s">{c.locationAddress}</div>
      </div>
    );
  }

  const detail =
    c.visibility === "private"
      ? `Room ${c.roomNumber}`
      : c.landmark;

  return (
    <div className="crow-loc">
      <div className="crow-loc-p">{c.hostelName}</div>
      <div className="crow-loc-s">
        Floor {c.floor} · {detail}
      </div>
    </div>
  );
}

function WorkerCell({ task }) {
  if (!task?.workerId) {
    return <span className="crow-empty">—</span>;
  }

  const initials = task.workerId.name
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="crow-worker">
      <div className="crow-wav">{initials}</div>
      <div>
        <div className="crow-wname">{task.workerId.name}</div>
        <div className="crow-wpos">{task.workerId.position}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Timeline Step
───────────────────────────────────────────── */

function TimelineStep({ label, time, done, last }) {
  const fmt = t =>
    t
      ? new Date(t).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  return (
    <div className="crow-tstep">
      <div className="crow-tstep-left">
        <div className={`crow-tstep-dot${done ? " done" : ""}`} />
        {!last && (
          <div className={`crow-tstep-line${done ? " done" : ""}`} />
        )}
      </div>

      <div className="crow-tstep-content">
        <div className={`crow-tstep-lbl${done ? " done" : ""}`}>
          {label}
        </div>

        {time && (
          <div className="crow-tstep-time">{fmt(time)}</div>
        )}

        {!time && !done && (
          <div className="crow-tstep-time crow-tstep-waiting">
            Waiting…
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

export default function ComplaintRow({ complaint: c, isExpanded, onToggle }) {
  const date = new Date(c.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const shortId = c._id?.slice(-6)?.toUpperCase() || "XXXXXX";

  const hasNotes =
    c.task?.notes &&
    (c.task.status === "completed" || c.task.status === "incomplete");

  return (
    <>
      {/* ── MAIN ROW ── */}
      <tr
        className={`crow-row${isExpanded ? " expanded" : ""}`}
        onClick={onToggle}
      >
        <td className="crow-td">
          <span className="crow-id">#{shortId}</span>
        </td>

        <td className="crow-td crow-desc-cell">
          <div className="crow-desc">{c.description}</div>

          <div className="crow-meta">
            <TypeBadge type={c.type} visibility={c.visibility} />
            <span className="crow-by">
              by {c.userId?.name ?? "Unknown"}
            </span>
          </div>
        </td>

        <td className="crow-td">
          <LocationCell c={c} />
        </td>

        <td className="crow-td crow-date">{date}</td>

        <td className="crow-td">
          <VotesBar votes={c.supporters?.length ?? 0} />
        </td>

        <td className="crow-td">
          <ComplaintStatusBadge status={c.status} />
        </td>

        <td className="crow-td">
          <TaskStatusBadge status={c.task?.status ?? null} />
        </td>

        <td className="crow-td">
          <WorkerCell task={c.task} />
        </td>

        <td className="crow-td crow-chev-cell">
          <svg
            className={`crow-chev${isExpanded ? " open" : ""}`}
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </td>
      </tr>

      {/* ── EXPANDED PANEL ── */}
      {isExpanded && (
        <tr className="crow-detail-row">
          <td colSpan={9} className="crow-detail-td">
            <div className="crow-detail-body">

              {/* Description */}
              <div className="crow-detail-sec">
                <div className="crow-detail-lbl">Description</div>
                <div className="crow-detail-text">{c.description}</div>
              </div>

              {/* Location */}
              <div className="crow-detail-sec">
                <div className="crow-detail-lbl">Location Details</div>

                {c.type === "campus" ? (
                  <div className="crow-detail-kv-list">
                    <div className="crow-kv">
                      <span>Area</span>
                      <strong>{c.area}</strong>
                    </div>
                    <div className="crow-kv">
                      <span>Address</span>
                      <strong>{c.locationAddress}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="crow-detail-kv-list">
                    <div className="crow-kv">
                      <span>Hostel</span>
                      <strong>{c.hostelName}</strong>
                    </div>

                    <div className="crow-kv">
                      <span>Floor</span>
                      <strong>{c.floor}</strong>
                    </div>

                    {c.visibility === "private" ? (
                      <div className="crow-kv">
                        <span>Room No.</span>
                        <strong>{c.roomNumber}</strong>
                      </div>
                    ) : (
                      <div className="crow-kv">
                        <span>Landmark</span>
                        <strong>{c.landmark}</strong>
                      </div>
                    )}

                    <div className="crow-kv">
                      <span>Visibility</span>
                      <strong style={{ textTransform: "capitalize" }}>
                        {c.visibility}
                      </strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {c.task ? (
                <div className="crow-detail-sec">
                  <div className="crow-detail-lbl">Task Timeline</div>

                  <div className="crow-timeline">
                    <TimelineStep
                      label="Complaint filed"
                      time={c.createdAt}
                      done
                    />

                    <TimelineStep
                      label={`Accepted by ${c.task.workerId?.name ?? "worker"}`}
                      time={c.task.acceptedAt}
                      done={!!c.task.acceptedAt}
                    />

                    <TimelineStep
                      label="Work started"
                      time={c.task.startedAt}
                      done={!!c.task.startedAt}
                    />

                    {(c.task.status === "completed" ||
                      c.task.status === "incomplete") && (
                      <TimelineStep
                        label={
                          c.task.status === "completed"
                            ? "Completed"
                            : "Marked incomplete"
                        }
                        time={c.task.completedAt}
                        done
                        last
                      />
                    )}
                  </div>

                  {/* Notes */}
                  {hasNotes && (
                    <div className={`crow-notes crow-notes-${c.task.status}`}>
                      <div className="crow-notes-header">
                        Worker Notes
                        <span className="crow-notes-by">
                          — {c.task.workerId?.name}
                        </span>
                      </div>

                      <div className="crow-notes-text">
                        {c.task.notes}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="crow-detail-sec">
                  <div className="crow-detail-lbl">Task Status</div>

                  <div className="crow-no-task">
                    No worker has accepted this complaint yet.
                  </div>
                </div>
              )}

              {/* Filed By */}
              <div className="crow-detail-sec crow-detail-sec-last">
                <div className="crow-detail-lbl">Filed By</div>

                <div className="crow-filed-by">
                  <div className="crow-filed-av">
                    {(c.userId?.name ?? "?")[0].toUpperCase()}
                  </div>

                  <div>
                    <div className="crow-filed-name">
                      {c.userId?.name}
                    </div>
                    <div className="crow-filed-email">
                      {c.userId?.email}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </td>
        </tr>
      )}
    </>
  );
}