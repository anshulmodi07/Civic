import { useState, useEffect } from "react";
import { getUser } from "../api/auth";
import { T } from "../styles/dashboardStyles";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (!user) return null;

  const adminAvatar = user.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  // Check if department is available (either from departmentId object or string)
  const deptName = user.department?.name || user.departmentId?.name || user.departmentId || "General";

  return (
    <div style={{
      padding: "32px",
      background: T.g50,
      minHeight: "100%",
      fontFamily: T.ff,
    }}>
      <h1 style={{
        fontSize: "24px",
        fontWeight: 700,
        color: T.g900,
        marginBottom: "24px",
        letterSpacing: "-0.01em",
      }}>
        Admin Profile
      </h1>

      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "36px",
        border: `1px solid ${T.g100}`,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        maxWidth: "600px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{
            width: "88px",
            height: "88px",
            borderRadius: "22px",
            background: `linear-gradient(135deg, ${T.blue}, #1E3A8A)`,
            color: "#fff",
            fontSize: "34px",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
          }}>
            {adminAvatar}
          </div>
          <div>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: T.g900, letterSpacing: "-0.02em" }}>{user.name}</h2>
            <div style={{ 
              display: "inline-block",
              background: T.blueLt,
              color: T.blue,
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 700,
              marginTop: "8px",
              textTransform: "capitalize",
            }}>
              {deptName} Department
            </div>
          </div>
        </div>

        <hr style={{ border: "none", borderTop: `1px solid ${T.g100}`, margin: "4px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ background: T.g50, padding: "16px", borderRadius: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: T.g400, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Email Address
            </label>
            <div style={{ fontSize: "15px", fontWeight: 600, color: T.g900, marginTop: "8px" }}>{user.email}</div>
          </div>
          
          <div style={{ background: T.g50, padding: "16px", borderRadius: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: T.g400, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Role & Status
            </label>
            <div style={{ fontSize: "15px", fontWeight: 600, color: T.g900, marginTop: "8px", textTransform: "capitalize", display: "flex", alignItems: "center", gap: "8px" }}>
              {user.role}
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981" }} title="Active"/>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "8px" }}>
          <button style={{
            padding: "12px 24px",
            background: T.g900,
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.target.style.opacity = 0.8}
          onMouseLeave={e => e.target.style.opacity = 1}
          >
            Edit Profile Details
          </button>
        </div>
      </div>
    </div>
  );
}