// src/data/shiftData.js

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const SHIFTS = [
  { id: "morning", label: "Morning", time: "6:00 AM – 2:00 PM",  bg: "#FEF3C7", clr: "#92400E", dot: "#F59E0B", icon: "🌅" },
  { id: "evening", label: "Evening", time: "2:00 PM – 10:00 PM", bg: "#EDE9FE", clr: "#5B21B6", dot: "#7C3AED", icon: "🌆" },
  { id: "night",   label: "Night",   time: "10:00 PM – 6:00 AM", bg: "#1E293B", clr: "#94A3B8", dot: "#475569", icon: "🌙" },
  { id: "off",     label: "Day Off", time: "Not scheduled",       bg: "#F1F5F9", clr: "#94A3B8", dot: "#CBD5E1", icon: "☀️" },
];

// Shift workers — pulled from mock/workers.js in real use
// These match the department-filtered workers from the API
export const SHIFT_WORKERS = [
  { id: "W-01", name: "Ramesh Kumar", ini: "RK", type: "Senior Electrician" },
  { id: "W-02", name: "Priya Sharma", ini: "PS", type: "Electrician"        },
  { id: "W-03", name: "Ajay Verma",   ini: "AV", type: "Jr. Electrician"    },
  { id: "W-04", name: "Sunita Yadav", ini: "SY", type: "Electrician"        },
  { id: "W-05", name: "Mohan Singh",  ini: "MS", type: "Electrician"        },
  { id: "W-06", name: "Kavita Patel", ini: "KP", type: "Sr. Electrician"    },
];

// Default schedule: workerId → day → shiftId
export const INIT_SCHEDULE = {
  "W-01": { Mon: "morning", Tue: "morning", Wed: "morning", Thu: "morning", Fri: "morning", Sat: "off",     Sun: "off"     },
  "W-02": { Mon: "evening", Tue: "evening", Wed: "evening", Thu: "evening", Fri: "evening", Sat: "evening", Sun: "off"     },
  "W-03": { Mon: "morning", Tue: "morning", Wed: "off",     Thu: "morning", Fri: "morning", Sat: "off",     Sun: "off"     },
  "W-04": { Mon: "night",   Tue: "night",   Wed: "night",   Thu: "off",     Fri: "night",   Sat: "night",   Sun: "night"   },
  "W-05": { Mon: "off",     Tue: "evening", Wed: "evening", Thu: "evening", Fri: "off",     Sat: "morning", Sun: "morning" },
  "W-06": { Mon: "morning", Tue: "off",     Wed: "morning", Thu: "morning", Fri: "morning", Sat: "evening", Sun: "off"     },
};