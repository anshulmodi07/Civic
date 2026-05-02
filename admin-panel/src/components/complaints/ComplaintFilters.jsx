// src/components/complaints/ComplaintFilters.jsx
import "./complaints.css";

const STATUS_PILLS = [
  { key: "all",         label: "All"         },
  { key: "pending",     label: "Pending"     },
  { key: "completed",   label: "Completed"   },
  { key: "incompleted", label: "Incompleted" },
];

const TYPE_PILLS = [
  { key: "all",    label: "All Locations" },
  { key: "hostel", label: "Hostel"        },
  { key: "campus", label: "Campus"        },
];

const SORT_OPTS = [
  { value: "newest",      label: "Newest first"  },
  { value: "oldest",      label: "Oldest first"  },
  { value: "most_votes",  label: "Most votes"    },
  { value: "least_votes", label: "Least votes"   },
];

export default function ComplaintFilters({
  statusFilter, typeFilter, sortBy, searchQuery,
  onStatusChange, onTypeChange, onSortChange, onSearchChange,
  totalShowing, totalAll,
}) {
  return (
    <div className="cfilter-root">

      {/* Row 1 — search + sort */}
      <div className="cfilter-top">
        <div className="cfilter-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="cfilter-search-ico">
            <circle cx="11" cy="11" r="7"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="cfilter-search"
            type="text"
            placeholder="Search by description, location, worker…"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button className="cfilter-clear" onClick={() => onSearchChange("")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        <div className="cfilter-sort-wrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          <select
            className="cfilter-sort"
            value={sortBy}
            onChange={e => onSortChange(e.target.value)}
          >
            {SORT_OPTS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2 — filter pills + count */}
      <div className="cfilter-pills-row">
        <div className="cfilter-group">
          <span className="cfilter-group-lbl">Status</span>
          {STATUS_PILLS.map(p => (
            <button
              key={p.key}
              className={`cfilter-pill${statusFilter === p.key ? " on" : ""}`}
              onClick={() => onStatusChange(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="cfilter-group">
          <span className="cfilter-group-lbl">Location</span>
          {TYPE_PILLS.map(p => (
            <button
              key={p.key}
              className={`cfilter-pill${typeFilter === p.key ? " on" : ""}`}
              onClick={() => onTypeChange(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="cfilter-count">
          Showing <strong>{totalShowing}</strong> of <strong>{totalAll}</strong>
        </div>
      </div>
    </div>
  );
}