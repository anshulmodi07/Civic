export default function StatusBadge({ status }) {
  const colors = {
    active: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    completed: "bg-blue-100 text-blue-600",
    inactive: "bg-red-100 text-red-600"
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${colors[status]}`}>
      {status}
    </span>
  );
}