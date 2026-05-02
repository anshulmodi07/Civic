export default function DepartmentSelect({ value, onChange }) {
  return (
    <div className="fld">
      <label>Department</label>

      <div className="inp-wrap">
        <select
          style={{
            width: "100%",
            padding: "12px 40px 12px 16px",
            background: "#FAFAFA",
            border: "1.5px solid #E5E7EB",
            borderRadius: "12px",
            fontSize: "14px",
            color: "#111827",
            outline: "none",
            appearance: "none",
            cursor: "pointer"
          }}
          value={value}
          onChange={onChange}
          required
        >
          <option value="">Select Department</option>

          {/* ✅ MATCH DB ENUM */}
          <option value="electrician">Electrical</option>
          <option value="plumber">Plumbing</option>
          <option value="wifi">WiFi</option>
          <option value="civil">Civil / Construction</option>
        </select>

        <div
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#C4B5FD"
          }}
        >
          ▼
        </div>
      </div>
    </div>
  );
}