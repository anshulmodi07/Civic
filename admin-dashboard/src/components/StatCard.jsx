export default function StatCard({ title, value }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16 }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}
