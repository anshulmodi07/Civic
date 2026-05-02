import { useState, useMemo, useEffect } from "react";
import { getComplaints } from "../api/complaintApi";

import ComplaintStatsBar from "../components/complaints/ComplaintStatsBar";
import ComplaintFilters from "../components/complaints/ComplaintFilters";
import ComplaintTable from "../components/complaints/ComplaintTable";

import "../components/complaints/complaints.css";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  // 🔥 FETCH FROM API
  useEffect(() => {
    const load = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        // ⚠️ Adjust depending on your login structure
        const deptId = user?.departmentId || user?.department;

        const data = await getComplaints(deptId);

        setComplaints(data || []);
      } catch (err) {
        console.error("Complaint load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ── FILTER + SORT ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...complaints];

    if (statusFilter !== "all")
      list = list.filter(c => c.status === statusFilter);

    if (typeFilter !== "all")
      list = list.filter(c => c.type === typeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter(c => {
        const id     = c._id?.slice(-6)?.toLowerCase() || "";
        const desc   = c.description?.toLowerCase() || "";
        const area   = (c.area ?? "").toLowerCase();
        const addr   = (c.locationAddress ?? "").toLowerCase();
        const hostel = (c.hostelName ?? "").toLowerCase();
        const worker = (c.task?.workerId?.name ?? "").toLowerCase();
        const user   = (c.userId?.name ?? "").toLowerCase();

        return [id, desc, area, addr, hostel, worker, user].some(v =>
          v.includes(q)
        );
      });
    }

    list.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);

      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);

      if (sortBy === "most_votes")
        return (b.supporters?.length ?? 0) - (a.supporters?.length ?? 0);

      if (sortBy === "least_votes")
        return (a.supporters?.length ?? 0) - (b.supporters?.length ?? 0);

      return 0;
    });

    return list;
  }, [complaints, statusFilter, typeFilter, sortBy, search]);

  // ── CSV EXPORT ───────────────────────────────────────────────
  function exportCSV() {
    const headers = [
      "ID",
      "Type",
      "Location",
      "Description",
      "Status",
      "Task Status",
      "Worker",
      "Votes",
      "Filed On",
    ];

    const rows = filtered.map(c => [
      "#" + c._id.slice(-6).toUpperCase(),
      c.type,
      c.type === "campus" ? c.area : c.hostelName,
      `"${c.description.replace(/"/g, "'")}"`,
      c.status,
      c.task?.status ?? "unassigned",
      c.task?.workerId?.name ?? "—",
      c.supporters?.length ?? 0,
      new Date(c.createdAt).toLocaleDateString("en-IN"),
    ]);

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "complaints.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="cp-page">

      {/* Header */}
      <div className="cp-header">
        <div>
          <h1 className="cp-title">All Complaints</h1>
          <p className="cp-subtitle">
            Monitor and manage all complaints raised under your department
          </p>
        </div>

        <button className="cp-export" onClick={exportCSV}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <ComplaintStatsBar complaints={complaints} />

      {/* Filters */}
      <ComplaintFilters
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        sortBy={sortBy}
        searchQuery={search}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        onSortChange={setSortBy}
        onSearchChange={setSearch}
        totalShowing={filtered.length}
        totalAll={complaints.length}
      />

      {/* Table */}
      <ComplaintTable
        complaints={filtered}
        isLoading={loading}
      />

    </div>
  );
}