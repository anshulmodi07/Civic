export default function Table({ columns, data }) {
  return (
    <table className="w-full bg-white shadow rounded-xl overflow-hidden">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((col, i) => (
            <th key={i} className="p-3 text-left">{col.header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-t">
            {columns.map((col, j) => (
              <td key={j} className="p-3">
                {row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}