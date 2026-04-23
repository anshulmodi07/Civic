// UI only — maps to Department collection dynamically
export const ISSUE_TYPES = [
  { label: "Electrician",  value: "electrician" },
  { label: "AC / HVAC",    value: "ac" },
  { label: "Plumber",      value: "plumber" },
  { label: "Construction", value: "construction" },
  { label: "Sanitation",   value: "sanitation" },
  { label: "WiFi / IT",    value: "wifi" },
];

export const COMPLAINT_TYPES = [
  { label: "Hostel", value: "hostel" },
  { label: "Campus", value: "campus" },
];

export const HOSTEL_NAMES = [
  { label: "Hostel A", value: "Hostel A" },
  { label: "Hostel B", value: "Hostel B" },
  { label: "Hostel C", value: "Hostel C" },
];

export const LOCATION_LANDMARKS = [
  { label: "Main Building",  value: "Main Building" },
  { label: "Library",        value: "Library" },
  { label: "Cafeteria",      value: "Cafeteria" },
  { label: "Sports Complex", value: "Sports Complex" },
  { label: "Auditorium",     value: "Auditorium" },
  { label: "Other",          value: "Other" },
];

export const COMPLAINT_STATUS = [
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Incomplete", value: "incompleted" },
];

export const USER_ROLES = {
  WORKER: "worker",
  CLIENT: "client",
};