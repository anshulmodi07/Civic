export default function ComplaintTable({ complaints, onAssign }) {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Description</th>
          <th>Issue</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {complaints.map((c) => (
          <tr key={c._id}>
            <td>{c.description}</td>
            <td>{c.issueType}</td>
            <td>{c.priority}</td>
            <td>{c.status}</td>
            <td>
              {c.status === "new" && (
                <button onClick={() => onAssign(c)}>Assign</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
