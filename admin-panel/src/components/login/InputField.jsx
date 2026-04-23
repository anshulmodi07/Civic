
export default function InputField({ label, type, value, onChange }) {
  return (
    <div className="fld">
      <label>{label}</label>
      <div className="inp-wrap">
        <input
          type={type}
          value={value}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
}