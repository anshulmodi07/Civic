import { useEffect, useState } from "react";
import { getComplaints } from "../../api/dashboardApi";
import { getUser } from "../../api/auth";
import { ST, FILTERS } from "../../data/dashboardData";
import { T, card, chRow, ctTitle, linkBtn } from "../../styles/dashboardStyles";
import Ico from "./Icon";

export default function ComplaintsTable() {
  const [filter, setFilter] = useState(null);
  const [hovRow, setHovRow] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const loadComplaints = async () => {
      const user = await getUser();
      if (!user) return;

      const data = await getComplaints(user.departmentId); // ✅ FIXED
      setComplaints(data || []);
    };

    loadComplaints();
  }, []);

  // ✅ FILTER USING DB STATUS
  const shown = complaints.filter(
    (c) => filter === null || c.status === filter
  );

  return (
    <div style={card}>
      <div style={card}>
        <div style={chRow}>
          <span style={ctTitle}>Recent Complaints</span>
          <button style={linkBtn}>View all →</button>
        </div>

        {/* Filters */}
        <div style={{
          display: "flex",
          gap: "4px",
          padding: "10px 20px",
          borderBottom: `1px solid ${T.g100}`
        }}>
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "5px 13px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: filter === f.key ? 600 : 500,
                cursor: "pointer",
                border: "none",
                fontFamily: T.ff,
                background: filter === f.key ? T.blueLt : "transparent",
                color: filter === f.key ? T.blue : T.g500,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: T.g50, borderBottom: `1px solid ${T.g100}` }}>
                {["ID", "Description", "Type", "Status", "Votes", "Worker"].map((h) => (
                  <th key={h} style={{
                    padding: "9px 18px",
                    textAlign: "left",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: T.g400,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{
                    padding: "20px",
                    textAlign: "center",
                    color: T.g400
                  }}>
                    No complaints found
                  </td>
                </tr>
              ) : (
                shown.map((c, i) => (
                  <tr
                    key={c._id}
                    onMouseEnter={() => setHovRow(i)}
                    onMouseLeave={() => setHovRow(null)}
                    style={{
                      borderBottom: `1px solid ${T.g100}`,
                      background: hovRow === i ? T.g50 : T.white,
                    }}
                  >
                    {/* ID */}
                    <td style={{ padding: "12px 18px" }}>
                      <span style={{
                        fontFamily: T.ffHead,
                        fontSize: "11px",
                        color: T.g400,
                        fontWeight: 600
                      }}>
                        {c._id?.slice(-6)}
                      </span>
                    </td>

                    {/* Description */}
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: T.g800
                      }}>
                        {c.description}
                      </div>
                    </td>

                    {/* Type */}
                    <td style={{ padding: "12px 18px" }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: T.g500
                      }}>
                        {c.type}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: "12px 18px" }}>
                      <span style={{
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 700,
                        background: ST[c.status]?.bg || "#E5E7EB",
                        color: ST[c.status]?.clr || "#374151",
                      }}>
                        {ST[c.status]?.label || c.status}
                      </span>
                    </td>

                    {/* Votes */}
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Ico n="up" sz={12} c={T.blueMd} />
                        <span style={{
                          fontFamily: T.ffHead,
                          fontSize: "14px",
                          fontWeight: 700,
                          color: T.blue
                        }}>
                          {c.supporters?.length || 0}
                        </span>
                      </div>
                    </td>

                    {/* Worker */}
                    <td style={{
                      padding: "12px 18px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: T.g500
                    }}>
                      {c.assignedWorkerId || "Unassigned"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}