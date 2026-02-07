import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/admin.api";
import { getAllComplaints } from "../api/complaint.api";
import StatCard from "../components/StatCard";
import MapView from "../components/MapView";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getDashboardStats().then((res) => setStats(res.data));
    getAllComplaints().then((res) => setComplaints(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: 16 }}>
        <StatCard title="Total" value={stats.totalComplaints} />
        <StatCard title="Open" value={stats.open} />
        <StatCard title="Closed" value={stats.closed} />
      </div>

      <h3>Complaint Map</h3>
      <MapView complaints={complaints} />
    </div>
  );
}
