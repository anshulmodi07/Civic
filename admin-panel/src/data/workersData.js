// src/data/workersData.js

export const T = {
  blue:   "#2563EB", blueLt:  "#EFF6FF", blueMd: "#BFDBFE",
  green:  "#059669", greenLt: "#ECFDF5",
  amber:  "#D97706", amberLt: "#FFFBEB",
  red:    "#DC2626", redLt:   "#FEF2F2",
  purple: "#7C3AED", purpleLt:"#F5F3FF",
  sky:    "#0EA5E9", skyLt:   "#F0F9FF",
  g50:  "#F8FAFC", g100: "#F1F5F9", g200: "#E2E8F0",
  g300: "#CBD5E1", g400: "#94A3B8", g500: "#64748B",
  g600: "#475569", g700: "#334155", g800: "#1E293B", g900: "#0F172A",
  white: "#FFFFFF",
  ff:     "'Manrope','Segoe UI',sans-serif",
  ffHead: "'Syne','Segoe UI',sans-serif",
};

export const SHIFT_S = {
  Morning: { background: "#FEF3C7", color: "#92400E" },
  Evening: { background: "#EDE9FE", color: "#5B21B6" },
  Night:   { background: "#1E293B", color: "#94A3B8" },
};

export const WORKERS_DATA = [
  {
    id: "W-01", name: "Ramesh Kumar",  ini: "RK", clr: "#2563EB",
    type: "Senior Electrician", dept: "Electrical",
    shift: "Morning", online: true,  active: true,
    tasksDone: 48, tasksTotal: 52, joined: "Jan 2022",
    phone: "+91 98765 43210", email: "ramesh.k@civicmitra.in",
    location: "Block A & B", rating: 4.8,
  },
  {
    id: "W-02", name: "Priya Sharma",  ini: "PS", clr: "#7C3AED",
    type: "Electrician",        dept: "Electrical",
    shift: "Evening", online: true,  active: true,
    tasksDone: 31, tasksTotal: 38, joined: "Mar 2022",
    phone: "+91 87654 32109", email: "priya.s@civicmitra.in",
    location: "Block C & D", rating: 4.6,
  },
  {
    id: "W-03", name: "Ajay Verma",    ini: "AV", clr: "#059669",
    type: "Jr. Electrician",    dept: "Electrical",
    shift: "Morning", online: false, active: true,
    tasksDone: 19, tasksTotal: 24, joined: "Aug 2023",
    phone: "+91 76543 21098", email: "ajay.v@civicmitra.in",
    location: "Hostel Zone",   rating: 4.2,
  },
  {
    id: "W-04", name: "Sunita Yadav",  ini: "SY", clr: "#D97706",
    type: "Electrician",        dept: "Electrical",
    shift: "Night",   online: true,  active: true,
    tasksDone: 27, tasksTotal: 27, joined: "Nov 2022",
    phone: "+91 65432 10987", email: "sunita.y@civicmitra.in",
    location: "Night Campus",  rating: 5.0,
  },
  {
    id: "W-05", name: "Mohan Singh",   ini: "MS", clr: "#0EA5E9",
    type: "Electrician",        dept: "Electrical",
    shift: "Morning", online: false, active: false,
    tasksDone: 12, tasksTotal: 20, joined: "Feb 2023",
    phone: "+91 54321 09876", email: "mohan.s@civicmitra.in",
    location: "Lab Complex",   rating: 3.9,
  },
  {
    id: "W-06", name: "Kavita Patel",  ini: "KP", clr: "#DC2626",
    type: "Sr. Electrician",    dept: "Electrical",
    shift: "Evening", online: true,  active: true,
    tasksDone: 41, tasksTotal: 45, joined: "Jun 2021",
    phone: "+91 43210 98765", email: "kavita.p@civicmitra.in",
    location: "Admin Block",   rating: 4.7,
  },
  
];