// import api from "./axios";
// import { USE_DEMO_API } from "./config";

// const DEMO_COMPLAINTS = [
//   {
//     _id: "c001",
//     type: "hostel",
//     hostelName: "hostel_a",
//     floor: "3",
//     roomNumber: "302",
//     issueType: "electrician",
//     description: "Ceiling fan not working and one electrical socket is damaged in room.",
//     status: "in-progress",
//     createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//     location: { lat: 28.5468, lng: 77.2741 },
//     upvotes: 6,
//     images: [],
//   },
//   {
//     _id: "c002",
//     type: "campus",
//     issue_type: "plumber",
//     locationLandmark: "cafeteria",
//     locationAddress: "Near Cafeteria Block B",
//     description: "Water leakage in the washing area, creating water puddles and floor damage.",
//     status: "assigned",
//     createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
//     location: { lat: 28.5412, lng: 77.2698 },
//     upvotes: 3,
//     images: [],
//   },
//   {
//     _id: "c003",
//     type: "hostel",
//     hostelName: "hostel_b",
//     floor: "2",
//     roomNumber: "205",
//     issueType: "ac",
//     description: "AC unit is not cooling properly, compressor seems faulty.",
//     status: "pending",
//     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//     location: { lat: 28.5489, lng: 77.2769 },
//     upvotes: 4,
//     images: [],
//   },
//   {
//     _id: "c004",
//     type: "campus",
//     issue_type: "sanitation",
//     locationLandmark: "main_building",
//     locationAddress: "Entrance area, main gate",
//     description: "Trash bins overflowing for 2 days, garbage scattered on ground. Pest infestation risk.",
//     status: "closed",
//     createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
//     location: { lat: 28.5435, lng: 77.2715 },
//     upvotes: 4,
//     images: [],
//   },
//   {
//     _id: "c005",
//     type: "hostel",
//     hostelName: "hostel_c",
//     floor: "1",
//     roomNumber: "108",
//     issueType: "wifi",
//     description: "WiFi signal is extremely weak in this wing, unable to connect for video calls.",
//     status: "pending",
//     createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//     location: { lat: 28.5501, lng: 77.2732 },
//     upvotes: 2,
//     images: [],
//   },
//   {
//     _id: "c006",
//     type: "campus",
//     issue_type: "construction",
//     locationLandmark: "sports_complex",
//     locationAddress: "Sports Complex renovation area",
//     description: "Construction debris on the pathway, creating a safety hazard for students.",
//     status: "in-progress",
//     createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//     location: { lat: 28.5458, lng: 77.2758 },
//     upvotes: 7,
//     images: [],
//   },
// ];

// const DEMO_MY_COMPLAINTS = [
//   DEMO_COMPLAINTS[0],
//   DEMO_COMPLAINTS[2],
//   DEMO_COMPLAINTS[4],
// ];

// const DEMO_DASHBOARD = {
//   myComplaints: DEMO_MY_COMPLAINTS.length,
//   activeComplaints: DEMO_MY_COMPLAINTS.filter((item) => item.status !== "closed").length,
//   resolvedComplaints: DEMO_MY_COMPLAINTS.filter((item) => item.status === "closed").length,
// };

// const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// const normalizeFormData = async (payload) => {
//   if (payload && typeof payload.get === "function") {
//     return {
//       description: payload.get("description"),
//       issueType: payload.get("issueType"),
//       location: JSON.parse(payload.get("location") || "{}"),
//       images: [],
//     };
//   }
//   return payload;
// };

// export const getCitizenDashboard = async () => {
//   if (USE_DEMO_API) {
//     await delay();
//     return { ...DEMO_DASHBOARD };
//   }

//   const response = await api.get("/dashboard/citizen");
//   return response.data;
// };

// export const getAllComplaints = async () => {
//   if (USE_DEMO_API) {
//     await delay();
//     return [...DEMO_COMPLAINTS];
//   }

//   const response = await api.get("/complaints");
//   return response.data;
// };

// export const getMyComplaints = async () => {
//   if (USE_DEMO_API) {
//     await delay();
//     return [...DEMO_MY_COMPLAINTS];
//   }

//   const response = await api.get("/complaints/my");
//   return response.data;
// };

// export const getComplaintById = async (id) => {
//   if (USE_DEMO_API) {
//     await delay();
//     return DEMO_COMPLAINTS.find((complaint) => complaint._id === id) || null;
//   }

//   const response = await api.get(`/complaints/${id}`);
//   return response.data;
// };

// export const getNearbyComplaints = async () => {
//   if (USE_DEMO_API) {
//     await delay();
//     return DEMO_COMPLAINTS.map((complaint) => ({
//       ...complaint,
//       supportCount: complaint.supporters?.length || 0,
//     }));
//   }

//   const response = await api.get("/complaints/nearby");
//   return response.data;
// };

// export const createComplaint = async (payload) => {
//   if (USE_DEMO_API) {
//     const normalized = await normalizeFormData(payload);
//     const newComplaint = {
//       _id: `c${Date.now()}`,
//       issueType: normalized.issueType || "other",
//       description: normalized.description || "Demo complaint created by user.",
//       status: "pending",
//       createdAt: new Date().toISOString(),
//       location: normalized.location || { lat: 0, lng: 0 },
//       supporters: [],
//       images: normalized.images || [],
//     };
//     DEMO_COMPLAINTS.unshift(newComplaint);
//     DEMO_MY_COMPLAINTS.unshift(newComplaint);
//     return newComplaint;
//   }

//   const config = payload && typeof payload.get === "function"
//     ? { headers: { "Content-Type": "multipart/form-data" } }
//     : undefined;

//   const response = await api.post("/complaints", payload, config);
//   return response.data;
// };

/**
 * complaint_api.js
 *
 * Demo-first API layer for the complaint management system.
 * All functions hit DEMO_DATA when USE_DEMO_API = true.
 * Swap to real backend by setting USE_DEMO_API = false — no other changes needed.
 *
 * Structure:
 *   - DEMO DATA       → in-memory store that mirrors real API shapes
 *   - HELPERS         → delay simulation, normalization, id generation
 *   - COMPLAINT CRUD  → create / read / update / delete
 *   - DASHBOARD       → aggregated citizen stats
 *   - NEARBY          → geo-filtered list
 *   - UPVOTE          → toggle support on a complaint
 */

import api from "./axios";
import { USE_DEMO_API } from "./config";

// ─── CONFIG ────────────────────────────────────────────────────────────────────
// USE_DEMO_API is controlled through environment variables so the app can switch
// cleanly between demo mode and real backend mode without changing source code.

// Simulated network latency (ms)
const DEMO_DELAY_MS = 500;

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
export const COMPLAINT_TYPES = {
  HOSTEL: "hostel",
  CAMPUS: "campus",
};

export const COMPLAINT_STATUS = {
  NEW: "new",
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in-progress",
  CLOSED: "closed",
};

/**
 * The app currently uses `pending` in UI flows, while the backend may treat the
 * initial complaint state as `new`. Use this helper to compare them as equivalent.
 */
const normalizeComplaintStatus = (status) => {
  if (status === COMPLAINT_STATUS.PENDING) return COMPLAINT_STATUS.NEW;
  return status;
};

const statusMatches = (actual, filter) => {
  if (!filter) return true;
  return normalizeComplaintStatus(actual) === normalizeComplaintStatus(filter);
};

export const ISSUE_TYPES = [
  { label: "Electrician", value: "electrician" },
  { label: "Plumber", value: "plumber" },
  { label: "AC / Cooling", value: "ac" },
  { label: "WiFi / Internet", value: "wifi" },
  { label: "Sanitation", value: "sanitation" },
  { label: "Construction / Civil", value: "construction" },
  { label: "Pest Control", value: "pest_control" },
  { label: "Furniture", value: "furniture" },
  { label: "Other", value: "other" },
];

export const HOSTEL_NAMES = [
  { label: "Hostel A", value: "hostel_a" },
  { label: "Hostel B", value: "hostel_b" },
  { label: "Hostel C", value: "hostel_c" },
  { label: "Hostel D", value: "hostel_d" },
];

export const LOCATION_LANDMARKS = [
  { label: "Main Building", value: "main_building" },
  { label: "Library", value: "library" },
  { label: "Cafeteria", value: "cafeteria" },
  { label: "Sports Complex", value: "sports_complex" },
  { label: "Admin Block", value: "admin_block" },
  { label: "Parking Lot", value: "parking_lot" },
  { label: "Main Gate", value: "main_gate" },
];

// ─── DEMO DATA STORE ──────────────────────────────────────────────────────────
// Using a closure so mutations (create/upvote) persist within a session.
const createDemoStore = () => {
  const complaints = [
    {
      _id: "c001",
      type: COMPLAINT_TYPES.HOSTEL,
      citizenId: "user_demo",
      hostelName: "hostel_a",
      floor: "3",
      roomNumber: "302",
      issueType: "electrician",
      priority: "medium",
      description:
        "Ceiling fan not working and one electrical socket is damaged in room. Already reported to warden but no action taken.",
      status: COMPLAINT_STATUS.IN_PROGRESS,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      location: { lat: 28.7450, lng: 77.1120 },
      supporters: ["user_demo"],
      upvotes: 6,
      comments: [],
      images: [],
      assignedTaskId: null,
      assignedTo: "Maintenance Team A",
    },
    {
      _id: "c002",
      type: COMPLAINT_TYPES.CAMPUS,
      citizenId: "user_demo",
      issueType: "plumber",
      priority: "medium",
      locationLandmark: "Mess Block",
      locationAddress: "Near Mess 2, NIT Delhi",
      description:
        "Water leakage in the dining hall area, creating puddles and slippery floors. Needs urgent repair.",
      status: COMPLAINT_STATUS.ASSIGNED,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      location: { lat: 28.7435, lng: 77.1140 },
      supporters: [],
      upvotes: 3,
      comments: [],
      images: [],
      assignedTaskId: "t001",
      assignedTo: "Plumbing Dept",
    },
    {
      _id: "c003",
      type: COMPLAINT_TYPES.HOSTEL,
      citizenId: "user_demo",
      hostelName: "hostel_b",
      floor: "2",
      roomNumber: "205",
      issueType: "ac",
      priority: "medium",
      description: "AC unit is not cooling properly in the girls' hostel common room.",
      status: COMPLAINT_STATUS.PENDING,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      location: { lat: 28.7462, lng: 77.1105 },
      supporters: [],
      upvotes: 4,
      comments: [],
      images: [],
      assignedTaskId: null,
    },
    {
      _id: "c004",
      type: COMPLAINT_TYPES.CAMPUS,
      citizenId: "user_demo",
      issueType: "sanitation",
      priority: "medium",
      locationLandmark: "Main Gate",
      locationAddress: "Entrance area, NIT Delhi main gate",
      description:
        "Trash bins overflowing near the main gate for 2 days. Garbage is spreading and attracting pests.",
      status: COMPLAINT_STATUS.CLOSED,
      createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      location: { lat: 28.7447, lng: 77.1168 },
      supporters: [],
      upvotes: 4,
      comments: [],
      images: [],
      assignedTaskId: null,
      assignedTo: "Sanitation Team",
    },
    {
      _id: "c005",
      type: COMPLAINT_TYPES.HOSTEL,
      citizenId: "user_demo",
      hostelName: "hostel_c",
      floor: "1",
      roomNumber: "108",
      issueType: "wifi",
      priority: "medium",
      description:
        "WiFi signal is extremely weak in the girls' hostel block, making online classes difficult.",
      status: COMPLAINT_STATUS.PENDING,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      location: { lat: 28.7471, lng: 77.1149 },
      supporters: [],
      upvotes: 2,
      comments: [],
      images: [],
      assignedTaskId: null,
    },
    {
      _id: "c006",
      type: COMPLAINT_TYPES.CAMPUS,
      citizenId: "user_demo",
      issueType: "construction",
      priority: "medium",
      locationLandmark: "Sports Complex",
      locationAddress: "NIT Delhi sports complex",
      description:
        "Construction debris on the pathway, creating a safety hazard for students passing between buildings.",
      status: COMPLAINT_STATUS.IN_PROGRESS,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      location: { lat: 28.7423, lng: 77.1113 },
      supporters: [],
      upvotes: 7,
      comments: [],
      images: [],
      assignedTaskId: null,
      assignedTo: "Civil Works Team",
    },
  ];

  // IDs that belong to the currently logged-in demo user
  const myComplaintIds = new Set(["c001", "c003", "c005"]);

  return {
    complaints,
    myComplaintIds,
    getAll: () => [...complaints],
    getMine: () => complaints.filter((c) => myComplaintIds.has(c._id)),
    getById: (id) => complaints.find((c) => c._id === id) || null,
    getNearby: (lat, lng, radiusKm = 5) =>
      complaints.filter((c) => {
        if (!c.location) return false;
        const dist = haversineKm(lat, lng, c.location.lat, c.location.lng);
        return dist <= radiusKm;
      }),
    add: (complaint) => {
      complaints.unshift(complaint);
      myComplaintIds.add(complaint._id);
    },
    updateStatus: (id, status) => {
      const c = complaints.find((x) => x._id === id);
      if (c) {
        c.status = status;
        c.updatedAt = new Date().toISOString();
      }
    },
    toggleUpvote: (id, userId) => {
      const c = complaints.find((x) => x._id === id);
      if (!c) return null;
      const idx = c.upvotedBy.indexOf(userId);
      if (idx === -1) {
        c.upvotedBy.push(userId);
        c.upvotes += 1;
      } else {
        c.upvotedBy.splice(idx, 1);
        c.upvotes -= 1;
      }
      return { upvotes: c.upvotes, upvoted: idx === -1 };
    },
    delete: (id) => {
      const idx = complaints.findIndex((c) => c._id === id);
      if (idx !== -1) complaints.splice(idx, 1);
      myComplaintIds.delete(id);
    },
  };
};

// Singleton store
const DEMO_STORE = createDemoStore();

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const delay = (ms = DEMO_DELAY_MS) => new Promise((res) => setTimeout(res, ms));

const genId = () => `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

/** Haversine great-circle distance in km */
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Normalizes both plain objects and FormData into a consistent shape.
 * Used so demo + real API paths handle the same input format.
 */
const normalizePayload = async (payload) => {
  if (payload && typeof payload.get === "function") {
    return {
      type: payload.get("type"),
      hostelName: payload.get("hostelName") || null,
      floor: payload.get("floor") || null,
      roomNumber: payload.get("roomNumber") || null,
      locationLandmark: payload.get("locationLandmark") || null,
      locationAddress: payload.get("locationAddress") || null,
      issueType: payload.get("issueType"),
      description: payload.get("description"),
      location: JSON.parse(payload.get("location") || "{}"),
      images: [], // FormData images are handled server-side
    };
  }
  return { images: [], ...payload };
};

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────
/**
 * Returns aggregated stats for the logged-in citizen.
 * Shape: { myComplaints, activeComplaints, resolvedComplaints, pendingComplaints }
 */
export const getCitizenDashboard = async () => {
  if (USE_DEMO_API) {
    await delay();
    const mine = DEMO_STORE.getMine();
    return {
      myComplaints: mine.length,
      activeComplaints: mine.filter(
        (c) => c.status === COMPLAINT_STATUS.IN_PROGRESS || c.status === COMPLAINT_STATUS.ASSIGNED
      ).length,
      pendingComplaints: mine.filter(
        (c) => normalizeComplaintStatus(c.status) === COMPLAINT_STATUS.NEW
      ).length,
      resolvedComplaints: mine.filter((c) => c.status === COMPLAINT_STATUS.CLOSED).length,
    };
  }

  const response = await api.get("/dashboard/citizen");
  return response.data;
};

// ─── COMPLAINT READS ───────────────────────────────────────────────────────────
/** Returns ALL complaints (admin / feed view). */
export const getAllComplaints = async ({ status, type, issueType } = {}) => {
  if (USE_DEMO_API) {
    await delay();
    let results = DEMO_STORE.getAll();
    if (status) results = results.filter((c) => statusMatches(c.status, status));
    if (type) results = results.filter((c) => c.type === type);
    if (issueType) results = results.filter((c) => c.issueType === issueType);
    return results;
  }

  const response = await api.get("/complaints", { params: { status, type, issueType } });
  return response.data;
};

/** Returns only the current user's complaints. */
export const getMyComplaints = async () => {
  if (USE_DEMO_API) {
    await delay();
    return DEMO_STORE.getMine();
  }

  const response = await api.get("/complaints/my");
  return response.data;
};

/** Returns a single complaint by ID. */
export const getComplaintById = async (id) => {
  if (USE_DEMO_API) {
    await delay();
    return DEMO_STORE.getById(id);
  }

  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

/**
 * Returns complaints within `radiusKm` of the given coordinates.
 * Falls back to all complaints in demo mode when no coords given.
 */
export const getNearbyComplaints = async ({ lat, lng, radiusKm = 5 } = {}) => {
  if (USE_DEMO_API) {
    await delay();
    const results =
      lat && lng
        ? DEMO_STORE.getNearby(lat, lng, radiusKm)
        : DEMO_STORE.getAll();
    return results.map((c) => ({ ...c, supportCount: c.upvotes }));
  }

  const response = await api.get("/complaints/nearby", { params: { lat, lng, radiusKm } });
  return response.data;
};

// ─── COMPLAINT MUTATIONS ───────────────────────────────────────────────────────
/**
 * Creates a new complaint.
 * Accepts either a plain object or a FormData instance.
 * Returns the created complaint object.
 */
export const createComplaint = async (payload) => {
  if (USE_DEMO_API) {
    const data = await normalizePayload(payload);
    const newComplaint = {
      _id: genId(),
      type: data.type || COMPLAINT_TYPES.CAMPUS,
      citizenId: "user_demo",
      hostelName: data.hostelName || null,
      floor: data.floor || null,
      roomNumber: data.roomNumber || null,
      locationLandmark: data.locationLandmark || null,
      locationAddress: data.locationAddress || null,
      issueType: data.issueType || "other",
      priority: data.priority || "medium",
      description: data.description || "",
      status: COMPLAINT_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: data.location || { lat: 0, lng: 0 },
      supporters: [],
      upvotes: 0,
      comments: [],
      images: data.images || [],
      assignedTaskId: null,
      assignedTo: null,
    };
    await delay();
    DEMO_STORE.add(newComplaint);
    return newComplaint;
  }

  const isFormData = payload && typeof payload.get === "function";
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : undefined;

  const response = await api.post("/complaints", payload, config);
  return response.data;
};

/**
 * Toggles upvote on a complaint for the given userId.
 * Returns { upvotes: number, upvoted: boolean }
 */
export const toggleUpvote = async (complaintId, userId = "user_demo") => {
  if (USE_DEMO_API) {
    await delay(200);
    const result = DEMO_STORE.toggleUpvote(complaintId, userId);
    if (!result) throw new Error(`Complaint ${complaintId} not found`);
    return result;
  }

  const response = await api.post(`/complaints/${complaintId}/support`);
  return {
    upvotes: response.data.supporters ?? 0,
    upvoted: true,
  };
};

/**
 * Deletes a complaint by ID (owner / admin only).
 * Returns { success: true } on success.
 */
export const deleteComplaint = async (id) => {
  if (USE_DEMO_API) {
    await delay();
    DEMO_STORE.delete(id);
    return { success: true };
  }

  const response = await api.delete(`/complaints/${id}`);
  return response.data;
};

/**
 * Updates complaint status (admin / staff only).
 * Returns the updated complaint.
 */
export const updateComplaintStatus = async (id, status) => {
  if (!Object.values(COMPLAINT_STATUS).includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }

  if (USE_DEMO_API) {
    await delay();
    DEMO_STORE.updateStatus(id, status);
    return DEMO_STORE.getById(id);
  }

  const response = await api.patch(`/complaints/${id}/status`, { status });
  return response.data;
};