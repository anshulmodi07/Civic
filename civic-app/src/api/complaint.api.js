import api from "./axios";
import { USE_DEMO_API } from "./config";

const DEMO_COMPLAINTS = [
  {
    _id: "c001",
    issueType: "road",
    description:
      "Large pothole near the Lajpat Nagar market entry gate. Two-wheelers have fallen twice this week.",
    status: "in-progress",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5468, lng: 77.2741 },
    supporters: ["u1", "u2", "u3", "u4", "u5", "u6"],
    images: [],
  },
  {
    _id: "c002",
    issueType: "water",
    description:
      "Water supply has been irregular for the past 10 days in Block C, Pocket 4, Okhla Phase 2.",
    status: "assigned",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5412, lng: 77.2698 },
    supporters: ["u2", "u5", "u7"],
    images: [],
  },
  {
    _id: "c003",
    issueType: "electricity",
    description:
      "Street lights on the main road between Okhla and Nehru Place have not been working for 3 weeks.",
    status: "pending",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5489, lng: 77.2769 },
    supporters: ["u3", "u8", "u9", "u10"],
    images: [],
  },
  {
    _id: "c004",
    issueType: "sanitation",
    description:
      "Garbage bins overflowing near Lajpat Rai Market for 4 days. No pickup has happened.",
    status: "closed",
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5435, lng: 77.2715 },
    supporters: ["u1", "u4", "u6", "u11"],
    images: [],
  },
  {
    _id: "c005",
    issueType: "road",
    description:
      "Footpath tiles broken and uneven near Delhi Metro Lajpat Nagar exit. Senior citizens and children are at risk of tripping.",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5501, lng: 77.2732 },
    supporters: ["u2", "u3"],
    images: [],
  },
  {
    _id: "c006",
    issueType: "water",
    description:
      "Sewage overflow onto the street near Amar Colony for the second time this month.",
    status: "in-progress",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: { lat: 28.5458, lng: 77.2758 },
    supporters: ["u1", "u5", "u6", "u7", "u8", "u9", "u12"],
    images: [],
  },
];

const DEMO_MY_COMPLAINTS = [
  DEMO_COMPLAINTS[2],
  DEMO_COMPLAINTS[4],
  DEMO_COMPLAINTS[3],
];

const DEMO_DASHBOARD = {
  myComplaints: DEMO_MY_COMPLAINTS.length,
  activeComplaints: DEMO_MY_COMPLAINTS.filter((item) => item.status !== "closed").length,
  resolvedComplaints: DEMO_MY_COMPLAINTS.filter((item) => item.status === "closed").length,
};

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeFormData = async (payload) => {
  if (payload && typeof payload.get === "function") {
    return {
      description: payload.get("description"),
      issueType: payload.get("issueType"),
      location: JSON.parse(payload.get("location") || "{}"),
      images: [],
    };
  }
  return payload;
};

export const getCitizenDashboard = async () => {
  if (USE_DEMO_API) {
    await delay();
    return { ...DEMO_DASHBOARD };
  }

  const response = await api.get("/dashboard/citizen");
  return response.data;
};

export const getAllComplaints = async () => {
  if (USE_DEMO_API) {
    await delay();
    return [...DEMO_COMPLAINTS];
  }

  const response = await api.get("/complaints");
  return response.data;
};

export const getMyComplaints = async () => {
  if (USE_DEMO_API) {
    await delay();
    return [...DEMO_MY_COMPLAINTS];
  }

  const response = await api.get("/complaints/my");
  return response.data;
};

export const getComplaintById = async (id) => {
  if (USE_DEMO_API) {
    await delay();
    return DEMO_COMPLAINTS.find((complaint) => complaint._id === id) || null;
  }

  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

export const getNearbyComplaints = async () => {
  if (USE_DEMO_API) {
    await delay();
    return DEMO_COMPLAINTS.map((complaint) => ({
      ...complaint,
      supportCount: complaint.supporters?.length || 0,
    }));
  }

  const response = await api.get("/complaints/nearby");
  return response.data;
};

export const createComplaint = async (payload) => {
  if (USE_DEMO_API) {
    const normalized = await normalizeFormData(payload);
    const newComplaint = {
      _id: `c${Date.now()}`,
      issueType: normalized.issueType || "other",
      description: normalized.description || "Demo complaint created by user.",
      status: "pending",
      createdAt: new Date().toISOString(),
      location: normalized.location || { lat: 0, lng: 0 },
      supporters: [],
      images: normalized.images || [],
    };
    DEMO_COMPLAINTS.unshift(newComplaint);
    DEMO_MY_COMPLAINTS.unshift(newComplaint);
    return newComplaint;
  }

  const config = payload && typeof payload.get === "function"
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : undefined;

  const response = await api.post("/complaints", payload, config);
  return response.data;
};
