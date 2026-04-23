export const STATS = [
  { label: "Total Complaints", num: "186", sub: "↑ 12% this week",       dir: "up",   icon: "alert", iconBg: "#EFF6FF", iconClr: "#2563EB", barClr: "#2563EB", barW: 72 },
  { label: "Resolved Today",   num: "24",  sub: "↑ 5 from yesterday",    dir: "up",   icon: "check", iconBg: "#ECFDF5", iconClr: "#059669", barClr: "#059669", barW: 60 },
  { label: "Pending",          num: "14",  sub: "Same as yesterday",      dir: "flat", icon: "clock", iconBg: "#FFFBEB", iconClr: "#D97706", barClr: "#D97706", barW: 30 },
  { label: "Active Workers",   num: "4/7", sub: "Currently on shift",     dir: "up",   icon: "users", iconBg: "#F5F3FF", iconClr: "#7C3AED", barClr: "#7C3AED", barW: 57 },
];

export const COMPLAINTS = [
  { id: "#CF-0041", title: "Power outage",   loc: "Hostel · Block C, Rm 302",   dept: "Electrical", dClr: "#F59E0B", dBg: "#FEF3C7", st: "r", votes: 14, worker: "W-07" },
  { id: "#CF-0040", title: "Leaking pipe",   loc: "Campus · Science Lab 2",      dept: "Electrical",   dClr: "#3B82F6", dBg: "#DBEAFE", st: "p", votes:  7, worker: "—"    },
  { id: "#CF-0039", title: "AC not cooling", loc: "Campus · Faculty Block A",    dept: "Electrical",  dClr: "#06B6D4", dBg: "#CFFAFE", st: "s", votes: 22, worker: "W-03" },
  { id: "#CF-0038", title: "WiFi dead zone", loc: "Campus · Main Library",       dept: "Electrical",       dClr: "#8B5CF6", dBg: "#EDE9FE", st: "p", votes: 19, worker: "—"    },
  { id: "#CF-0037", title: "Clogged drain",  loc: "Hostel · Block A, WC",       dept: "Electrical", dClr: "#10B981", dBg: "#D1FAE5", st: "r", votes:  5, worker: "W-11" },
];

export const ST = {
  p: { label: "Pending",     bg: "#FFFBEB", clr: "#D97706" },
  r: { label: "In Progress", bg: "#EFF6FF", clr: "#2563EB" },
  s: { label: "closed",    bg: "#ECFDF5", clr: "#059669" },
  x: { label: "Rejected",    bg: "#FEF2F2", clr: "#DC2626" },
};

// export const FILTERS = [
//   { label: "All", key: null }, { label: "Pending", key: "p" },
//   { label: "In Progress", key: "r" }, { label: "Resolved", key: "s" },
// ];
export const FILTERS = [
  { label: "All", key: null },
  { label: "new", key: "new" },
  { label: "Pending", key: "pending" },
  { label: "closed", key: "closed" },
  { label: "In Progress", key: "in-progress" }
];

export const ACTIVITY = [
  { dot: "#059669", bold: "Ajay Verma",    rest: " resolved complaint #CF-0039",           time: "2 min ago"  },
  { dot: "#2563EB", bold: "New complaint", rest: " filed — WiFi dead zone in Library",     time: "14 min ago" },
  { dot: "#D97706", bold: "Sunita Yadav",  rest: " accepted complaint #CF-0037",           time: "31 min ago" },
  { dot: "#7C3AED", bold: "Shift updated", rest: " — Evening shift now has 3 workers",     time: "1 hr ago"   },
  { dot: "#DC2626", bold: "#CF-0036",      rest: " marked high priority by Admin",         time: "2 hr ago"   },
];

export const WORKERS = [
  { name: "Ramesh Kumar", ini: "RK", clr: "#2563EB", type: "Senior Electrician", shift: "Morning", online: true,  tasks: "4/6" },
  { name: "Priya Sharma", ini: "PS", clr: "#7C3AED", type: "Electrician",        shift: "Evening", online: true,  tasks: "2/3" },
  { name: "Ajay Verma",   ini: "AV", clr: "#059669", type: "Jr. Electrician",    shift: "Morning", online: false, tasks: "1/2" },
  { name: "Sunita Yadav", ini: "SY", clr: "#D97706", type: "Electrician",        shift: "Night",   online: true,  tasks: "3/3" },
];

export const SHIFT_S = {
  Morning: { background: "#FEF3C7", color: "#92400E" },
  Evening: { background: "#EDE9FE", color: "#5B21B6" },
  Night:   { background: "#1E293B", color: "#94A3B8" },
};