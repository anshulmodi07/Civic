import { useEffect, useState } from "react";
import { getComplaintsByDepartment } from "../api/complaint.api";
import ComplaintTable from "../components/ComplaintTable";
import AssignWorkerModal from "../components/AssignWorkerModal";

const departments = ["water", "electricity", "road", "garbage"];

export default function Complaints() {
  const [activeDept, setActiveDept] = useState("water");
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    getComplaintsByDepartment(activeDept)
      .then((res) => setComplaints(res.data))
      .catch(() => alert("Failed to load complaints"));
  }, [activeDept]);

  const handleAssign = (complaint) => {
    setSelectedComplaint(complaint);
  };

  return (
    <div>
      <h2>Complaints Management</h2>

      {/* Department Tabs */}
      <div style={{ marginBottom: 16 }}>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            style={{
              marginRight: 8,
              fontWeight: activeDept === dept ? "bold" : "normal",
            }}
          >
            {dept.toUpperCase()}
          </button>
        ))}
      </div>

      <ComplaintTable complaints={complaints} onAssign={handleAssign} />

      {selectedComplaint && (
        <AssignWorkerModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onAssigned={() => {
            getComplaintsByDepartment(activeDept)
              .then((res) => setComplaints(res.data));
          }}
        />
      )}
    </div>
  );
}
