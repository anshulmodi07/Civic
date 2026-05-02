import { ACTIVITY } from "../../data/dashboardData";
import { card, chRow, ctTitle, linkBtn, T } from "../../styles/dashboardStyles";

export default function ActivityFeed() {
  return (
    <div style={card}>
      <div style={card}>
          <div style={chRow}>
            <span style={ctTitle}>Recent Activity</span>
            <button style={linkBtn}>Clear</button>
          </div>
          <div>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: "11px", padding: "12px 16px", borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${T.g100}` : "none", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "3px" }}>
                  <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
                  {i < ACTIVITY.length - 1 && <div style={{ width: "1px", flex: 1, background: T.g200, marginTop: "4px", minHeight: "18px" }} />}
                </div>
                <div>
                  <div style={{ fontSize: "12px", color: T.g700, lineHeight: 1.55 }}>
                    <strong style={{ fontWeight: 600, color: T.g900 }}>{a.bold}</strong>
                    {a.rest}
                  </div>
                  <div style={{ fontSize: "11px", color: T.g400, marginTop: "3px" }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}