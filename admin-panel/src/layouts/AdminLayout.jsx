import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar/Navbar";
import { Outlet } from "react-router-dom";
import { navbarData } from "../data/navbarData";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 256;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC" }}>

      {/* Sidebar */}
      <div style={{ width: sidebarWidth, flexShrink: 0, position: "fixed", left: 0, top: 0, height: "100vh", zIndex: 40, transition: "width 0.25s ease" }}>
        <Sidebar collapsed={collapsed} onCollapse={() => setCollapsed(v => !v)} />
      </div>

      {/* Right column — moves with sidebar */}
      <div style={{
        marginLeft: sidebarWidth,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100vh",
        overflow: "hidden",
        transition: "margin-left 0.25s ease",
      }}>
        <div style={{ flexShrink: 0 }}>
          <Navbar department={navbarData.department}
                  adminName={navbarData.name}
                  adminAvatar={navbarData.avatar} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}