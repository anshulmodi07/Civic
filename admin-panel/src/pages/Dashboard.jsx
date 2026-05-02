import { useState, useEffect } from "react";
import StatsCards from "../components/dashboard/StatsCards";
import ComplaintsTable from "../components/dashboard/ComplaintsTable";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import WorkersList from "../components/dashboard/WorkersList";
import DonutChart from "../components/dashboard/DonutChart";
import { T,card,chRow,ctTitle } from "../styles/dashboardStyles";


export default function Dashboard() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);
  return (
    <div style={{
      padding: "24px", background: T.g50, minHeight: "100%",
      fontFamily: T.ff, width: "100%", boxSizing: "border-box",
    }}>

      {/* ── Heading ── */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontFamily: T.ffHead, fontSize: "20px", fontWeight: 700, color: T.g900, margin: 0, letterSpacing: "-0.01em" }}>
          Welcome, {user?.name || "User"}
        </h1>
        <p style={{ fontSize: "13px", color: T.g400, marginTop: "4px", margin: "4px 0 0" }}>
          {user?.department
            ? `${user.department.toUpperCase()} Department`
            : "Department — live summary"}
        </p>
      </div>


      <StatsCards/>
      
      <div style={{ display: "grid", gap: "14px", marginBottom: "16px" }}>
        <ComplaintsTable />
        
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 270px", gap: "14px" }}>
        <WorkersList />
        <div style={card}>
          <div style={chRow}><span style={ctTitle}>Complaint Status</span></div>
          <DonutChart />
        </div>
      </div>

    </div>
  );
}