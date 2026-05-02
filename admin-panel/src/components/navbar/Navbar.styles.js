export const S = {
  // Outer bar
  bar: {
    width: "100%",
    height: "64px",
    background: "#ffffff",
    borderBottom: "1px solid #E2E8F0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    fontFamily: "'Manrope', 'Segoe UI', sans-serif",
    flexShrink: 0,
    position: "relative",
    zIndex: 10,
  },

  // Left side
  left: { display: "flex", alignItems: "center", gap: "16px" },
  pageTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.01em",
  },
  divider: {
    width: "1px", height: "20px",
    background: "#E2E8F0",
  },
  breadcrumb: {
    fontSize: "13px", color: "#94A3B8", fontWeight: 500,
  },

  // Search
  searchWrap: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "8px 14px",
    cursor: "text",
    transition: "border-color 0.2s",
  },
  searchInput: {
    background: "none", border: "none", outline: "none",
    fontSize: "13px", color: "#334155",
    width: "180px", fontFamily: "inherit",
  },

  // Right side
  right: { display: "flex", alignItems: "center", gap: "15px" },

  // Icon button
  iconBtn: {
    width: "38px", height: "38px",
    borderRadius: "10px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    color: "#64748B",
    position: "relative",
    transition: "background 0.15s",
    flexShrink: 0,
  },

  // Notification dot
  notifDot: {
    position: "absolute", top: "8px", right: "8px",
    width: "7px", height: "7px",
    borderRadius: "50%", background: "#DC2626",
    border: "2px solid #ffffff",
  },

  // Dept badge
  deptBadge: {
    display: "flex", alignItems: "center", gap: "7px",
    background: "#EFF6FF",
    border: "1px solid #BFDBFE",
    borderRadius: "10px",
    padding: "6px 14px",
  },
  deptDot: {
    width: "7px", height: "7px",
    borderRadius: "50%", background: "#2563EB",
    flexShrink: 0,
  },
  deptText: {
    fontSize: "12px", fontWeight: 600, color: "#1D4ED8",
  },

  // Avatar
  avatar: {
    width: "44px", height: "44px",
    borderRadius: "23px",
    background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: 700, color: "#fff",
    cursor: "pointer", flexShrink: 0,
    userSelect: "none",
  },

  // Dropdown
  dropdownWrap: { position: "relative" },
  dropdown: {
    position: "absolute", top: "calc(100% + 8px)", right: 0,
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: "14px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    minWidth: "200px",
    overflow: "hidden",
    zIndex: 100,
  },
  dropHead: {
    padding: "14px 16px",
    borderBottom: "1px solid #F1F5F9",
  },
  dropName: { fontSize: "13px", fontWeight: 700, color: "#0F172A" },
  dropRole: { fontSize: "11px", color: "#94A3B8", marginTop: "2px" },
  dropItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "11px 16px",
    fontSize: "13px", fontWeight: 500, color: "#475569",
    cursor: "pointer",
    transition: "background 0.15s",
    border: "none", background: "none",
    width: "100%", textAlign: "left",
    fontFamily: "inherit",
  },
};
