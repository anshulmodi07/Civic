export const T = {
  blue:     "#2563EB", blueLt: "#EFF6FF", blueMd: "#BFDBFE",
  green:    "#059669", greenLt: "#ECFDF5",
  amber:    "#D97706", amberLt: "#FFFBEB",
  red:      "#DC2626", redLt: "#FEF2F2",
  purple:   "#7C3AED", purpleLt: "#F5F3FF",
  g50:  "#F8FAFC", g100: "#F1F5F9", g200: "#E2E8F0",
  g300: "#CBD5E1", g400: "#94A3B8", g500: "#64748B",
  g600: "#475569", g700: "#334155", g800: "#1E293B", g900: "#0F172A",
  white: "#FFFFFF",
  ff:     "'Manrope','Segoe UI',sans-serif",
  ffHead: "'Syne','Segoe UI',sans-serif",
};

export const card    = { background: T.white, borderRadius: "16px", border: `1px solid ${T.g200}`, overflow: "hidden" };
export const chRow   = { padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.g100}` };
export const ctTitle = { fontFamily: T.ffHead, fontSize: "15px", fontWeight: 700, color: T.g900 };
export const linkBtn = { fontSize: "13px", fontWeight: 600, color: T.blue, background: "none", border: "none", cursor: "pointer", fontFamily: T.ff, padding: 0 };
