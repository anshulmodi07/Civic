import { useEffect, useState } from "react";
import { getWorkers } from "../api/user.api";
import { assignTask } from "../api/task.api";

export default function AssignWorkerModal({ complaint, onClose, onAssigned }) {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");

  useEffect(() => {
    getWorkers().then((res) => setWorkers(res.data));
  }, []);

  const handleAssign = async () => {
    await assignTask(complaint._id, selectedWorker);
    onAssigned();
    onClose();
  };

  return (
    <div style={{ border: "1px solid black", padding: 16 }}>
      <h3>Assign Worker</h3>

      <select onChange={(e) => setSelectedWorker(e.target.value)}>
        <option value="">Select worker</option>
        {workers.map((w) => (
          <option key={w._id} value={w._id}>
            {w.name} ({w.skills.join(", ")})
          </option>
        ))}
      </select>

      <br /><br />
      <button onClick={handleAssign} disabled={!selectedWorker}>
        Assign
      </button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
