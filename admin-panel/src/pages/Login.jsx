import styles from "../styles/loginStyles";
import LeftPanel from "../components/login/LeftPanel";
import LoginCard from "../components/login/LoginCard";


export default function Login() {
  return (
    <>
      <style>{styles}</style>
      <div className="root">
        {/* Background blobs */}
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />

        {/* ── Left panel ── */}

        <LeftPanel />
        {/* ── Right panel ── */}
        <div className="right">
          <LoginCard />
        </div>
      </div>
    </>
  );
}