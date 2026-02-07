import { useEffect, useState } from "react";
import { getAuditLogs } from "../api/admin.api";

export default function Audit() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAuditLogs().then((res) => setLogs(res.data));
  }, []);

  return (
    <div>
      <h2>Audit Logs</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Action</th>
            <th>Entity</th>
            <th>Old Status</th>
            <th>New Status</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.actionType}</td>
              <td>{log.entityType}</td>
              <td>{log.oldStatus}</td>
              <td>{log.newStatus}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
