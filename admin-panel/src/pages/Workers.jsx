// src/pages/Workers.jsx

import { useState, useEffect } from "react";
import { T } from "../data/workersData";
import { fetchWorkers } from "../api/workerApi";
import { getUser } from "../api/auth";

import WorkerIcon from "../components/workers/WorkerIcon";
import WorkerToolbar from "../components/workers/WorkerToolbar";
import WorkerCard from "../components/workers/WorkerCard";
import WorkerDetailPanel from "../components/workers/WorkerDetailPanel";
import AddWorkerModal from "../components/workers/AddWorkerModal";

export default function Workers() {
  const [search, setSearch] = useState("");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [workers, setWorkers] = useState([]);

  // ─── Load workers ─────────────────────────────
  useEffect(() => {
    const loadWorkers = async () => {
      const user = await getUser();
      if (!user) return;

      const data = await fetchWorkers(user.departmentId);
      setWorkers(data || []);
    };

    loadWorkers();
  }, []);

  // ─── Filter logic (FIXED) ─────────────────────
  const filtered = workers.filter(w => {
    const q = search.toLowerCase();

    const matchSearch =
      w.name?.toLowerCase().includes(q) ||
      w._id?.toLowerCase().includes(q) ||
      w.position?.toLowerCase().includes(q);

    const matchShift =
      shiftFilter === "All" ||
      w.currentShift === shiftFilter.toLowerCase();

    return matchSearch && matchShift;
  });

  const total = workers.length;

  return (
    <div style={{
      padding: "24px",
      background: T.g50,
      minHeight: "100%",
      fontFamily: T.ff,
      width: "100%",
      boxSizing: "border-box",
    }}>

      {/* ── Heading ── */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "22px"
      }}>
        <div>
          <h1 style={{
            fontFamily: T.ffHead,
            fontSize: "20px",
            fontWeight: 700,
            color: T.g900,
            margin: 0
          }}>
            Workers
          </h1>

          <p style={{
            fontSize: "13px",
            color: T.g400,
            marginTop: "4px"
          }}>
            Manage department workers
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "11px",
            background: T.blue,
            color: "#fff",
            border: "none",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <WorkerIcon n="plus" sz={15} c="#fff" />
          Add Worker
        </button>
      </div>

      {/* ── Toolbar ── */}
      <WorkerToolbar
        search={search}
        onSearch={setSearch}
        shiftFilter={shiftFilter}
        onShiftFilter={setShiftFilter}
        viewMode={viewMode}
        onViewMode={setViewMode}
        total={total}
        filteredCount={filtered.length}
      />

      {/* ── Grid View ── */}
      {viewMode === "grid" ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
          gap: "14px"
        }}>
          {filtered.map(w => (
            <WorkerCard key={w._id} w={w} onSelect={setSelected} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div style={{
          background: T.white,
          borderRadius: "16px",
          border: `1px solid ${T.g200}`,
          overflow: "hidden"
        }}>
          {filtered.map(w => (
            <WorkerCard key={w._id} w={w} onSelect={setSelected} viewMode="list" />
          ))}

          {filtered.length === 0 && (
            <div style={{
              padding: "40px",
              textAlign: "center",
              color: T.g400
            }}>
              No workers found
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && viewMode === "grid" && (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "32px" }}>🔍</div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>
            No workers found
          </div>
        </div>
      )}

      {/* Modals */}
      {selected && (
        <WorkerDetailPanel
          worker={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {showAdd && (
        <AddWorkerModal
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}