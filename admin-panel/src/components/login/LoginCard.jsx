import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "./InputField";
import PasswordField from "./PasswordField";
import DepartmentSelect from "./DepartmentSelect";
import { IconArrow, IconCheck } from "./Icons";
import { loginUser } from "../../api/auth";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser({
      email,
      password
    });

    // ✅ store token
    localStorage.setItem("token", data.token);

    // (optional temporary for now)
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/admin/dashboard");

  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="card">
      <div className="card-top">
        <h2>Sign in</h2>
        <p>Welcome back — let's pick up where you left off</p>
      </div>

      <form onSubmit={handleSubmit}>
        <DepartmentSelect
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <InputField
          label="User Id"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <div className="meta">
          <div className="chk-row" onClick={() => setRemember(!remember)}>
            <div className={`chk-box${remember ? " on" : ""}`}>
              {remember && <IconCheck />}
            </div>
            <span className="chk-label">Remember me</span>
          </div>
        </div>

        <button type="submit" className="btn-main">
          Sign in <IconArrow />
        </button>
      </form>
    </div>
  );
}