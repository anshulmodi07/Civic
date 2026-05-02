import { IconEye, IconEyeOff } from "./Icons";

export default function PasswordField({
  value,
  onChange,
  showPassword,
  setShowPassword
}) {
  return (
    <div className="fld">
      <label>Password</label>
      <div className="inp-wrap">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
        />

        <button
          type="button"
          className="eye-btn"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
  );
}