import { useNavigate } from "react-router-dom";
import { S } from "./Navbar.styles";
import { useState, useEffect } from "react";
import {
  BellIcon,
  SearchIcon,
  SettingsIcon,
  LogoutIcon,
  ProfileIcon,
} from "./Navbar.icons";

export default function Navbar() {
  const [dropOpen, setDropOpen]   = useState(false);
  const [hovItem,  setHovItem]    = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const department = user?.department || "Department";
  const adminName = user?.name || "User";

  const adminAvatar = user?.name
  ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
  : "U";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short",
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={S.bar}>
      {/* ── Left ── */}
      <div style={S.left}>
        <span style={S.pageTitle}>Dashboard</span>
        <div style={S.divider} />
        <span style={S.breadcrumb}>{today}</span>
      </div>

      {/* ── Right ── */}
      <div style={S.right}>
        {/* Search */}
        {/* <div style={S.searchWrap}>
          <SearchIcon />
          <input
            style={S.searchInput}
            placeholder="Search complaints, workers…"
          />
        </div> */}

        {/* Department badge */}
        <div style={S.deptBadge}>
          <div style={S.deptDot} />
          <span style={S.deptText}>{department}</span>
        </div>

        {/* Notification bell */}
        <div style={S.iconBtn}>
          <BellIcon />
          <div style={S.notifDot} />
        </div>

        {/* Settings */}
        <div
          style={S.iconBtn}
          onClick={() => navigate("/admin/profile")}
        >
          <SettingsIcon />
        </div>

        {/* Avatar + dropdown */}
        <div style={S.dropdownWrap}>
          <div
            style={S.avatar}
            onClick={() => setDropOpen(v => !v)}
            title={adminName}
          >
            {adminAvatar}
          </div>

          {dropOpen && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setDropOpen(false)}
              />
              <div style={S.dropdown}>
                <div style={S.dropHead}>
                  <div style={S.dropName}>{adminName}</div>
                  <div style={S.dropRole}>Admin · {department}</div>
                </div>
                <button
                  style={{
                    ...S.dropItem,
                    background: hovItem === "profile" ? "#F8FAFC" : "none",
                  }}
                  onMouseEnter={() => setHovItem("profile")}
                  onMouseLeave={() => setHovItem(null)}
                  onClick={() => { navigate("/admin/profile"); setDropOpen(false); }}
                >
                  <ProfileIcon /> My Profile
                </button>
                <button
                  style={{
                    ...S.dropItem,
                    background: hovItem === "settings" ? "#F8FAFC" : "none",
                  }}
                  onMouseEnter={() => setHovItem("settings")}
                  onMouseLeave={() => setHovItem(null)}
                  onClick={() => { navigate("/admin/profile"); setDropOpen(false); }}
                >
                  <SettingsIcon /> Settings
                </button>
                <div style={{ height: "1px", background: "#F1F5F9", margin: "4px 0" }} />
                <button
                  style={{
                    ...S.dropItem,
                    color: hovItem === "logout" ? "#DC2626" : "#475569",
                    background: hovItem === "logout" ? "#FEF2F2" : "none",
                  }}
                  onMouseEnter={() => setHovItem("logout")}
                  onMouseLeave={() => setHovItem(null)}
                  onClick={handleLogout}
                >
                  <LogoutIcon /> Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}