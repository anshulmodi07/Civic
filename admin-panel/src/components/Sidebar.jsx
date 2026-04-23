import { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import { MENU } from "../data/menuData";
import { DEPT_COLORS } from "../data/sidebarDepartmentData.js";
import { getIcon } from "../utils/iconMap.jsx";


export default function Sidebar({
    collapsed = false,        // ← controlled from outside now
    onCollapse = () => {},
}) {

    const [user, setUser] = useState(null);
    const department = user?.department || "Department";
    const adminName = user?.name || "User";
    const deptColor = DEPT_COLORS[department] || DEPT_COLORS.default;
    const navigate = useNavigate();
    const location = useLocation();
    const activePage = location.pathname.split("/")[2] || "dashboard";
    
    



    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);
    const adminAvatar = user?.name
        ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
        : "U";


    return (
        <>
            <aside className={`sb-root ${collapsed ? "collapsed" : "expanded"}`}>

                {/* Header */}
                <div className="sb-head">
                    {!collapsed && (
                        <div className="sb-logo">
                            <div className="sb-logo-mark">
                                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                                    <path d="M9 1.5L15.5 5.25V12.75L9 16.5L2.5 12.75V5.25L9 1.5Z" fill="white" fillOpacity="0.9" />
                                   <circle cx="9" cy="9" r="2.5" fill="white" />
                                </svg>
                            </div>
                            <span className="sb-logo-text">Civic<span>Mitra</span></span>
                        </div>
                    )}
                    {collapsed && <div style={{ width: 34 }} />}
                    <button className="sb-toggle" onClick={onCollapse}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            {collapsed
                                ? <polyline points="9 18 15 12 9 6" />
                                : <polyline points="15 18 9 12 15 6" />}
                        </svg>
                    </button>
                </div>

                {/* Department badge */}
                <div className="sb-dept">
                    <div className="sb-dept-dot" style={{ background: deptColor }} />
                    {!collapsed && (
                        <div className="sb-dept-info">
                            <div className="sb-dept-label">Department</div>
                            <div className="sb-dept-name">{department}</div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="sb-menu">
                    {MENU.map((item, idx) => (
                        <div key={item.id}>
                            {idx === MENU.length - 1 && <div className="sb-divider" />}
                            <div className="sb-item-wrap">
                                <button
                                    className={`sb-item${activePage === item.id ? " active" : ""}`}
                                    onClick={() => navigate(`/admin/${item.id}`)}
                                >
                                    <span className="sb-item-icon">{getIcon(item.icon)}</span>
                                    {!collapsed && (
                                        <>
                                            <span className="sb-item-label">{item.label}</span>
                                            {item.badge != null && (
                                                <span className="sb-badge">{item.badge}</span>
                                            )}
                                        </>
                                    )}
                                </button>
                                {collapsed && (
                                    <div className="sb-tooltip">{item.label}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* User card */}
                <div className="sb-user">
                    <div className="sb-avatar">{adminAvatar}</div>
                    {!collapsed && (
                        <>
                            <div className="sb-user-info">
                                <div className="sb-user-name">{adminName}</div>
                                <div className="sb-user-role">Admin · {department}</div>
                            </div>
                            <button
                                className="sb-logout"
                                onClick={() => {
                                    localStorage.clear();
                                    navigate("/");
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>

            </aside>
        </>
    );
}