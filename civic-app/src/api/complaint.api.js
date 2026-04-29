import api from "./axios";

const unwrap = (res) => res.data?.data ?? res.data;

export const getAssetUrl = (path) => {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("file:")) return path;
  const baseUrl = api.defaults.baseURL?.replace(/\/$/, "") || "";
  const normalizedPath = String(path).startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

/* =========================
   CREATE
========================= */

export const createComplaint = async (data) => {
  const res = await api.post("/complaints", data);
  return unwrap(res);
};

/* =========================
   READ
========================= */

export const getAllComplaints = async (filters = {}) => {
  const res = await api.get("/complaints", { params: filters });
  return unwrap(res);
};

export const getMyComplaints = async () => {
  const res = await api.get("/complaints/my");
  return unwrap(res);
};

export const getComplaintById = async (id) => {
  const res = await api.get(`/complaints/${id}`);
  return unwrap(res);
};

/* =========================
   UPDATE
========================= */

export const updateComplaint = async (id, data) => {
  const res = await api.put(`/complaints/${id}`, data);
  return unwrap(res);
};

/* =========================
   DELETE
========================= */

export const deleteComplaint = async (id) => {
  const res = await api.delete(`/complaints/${id}`);
  return unwrap(res);
};

/* =========================
   GEO SEARCH
========================= */

export const getNearbyComplaints = async (lat, lng, radiusKm = 5) => {
  const res = await api.get("/complaints/nearby", {
    params: { lat, lng, radiusKm },
  });
  return unwrap(res);
};

export const toggleSupport = async (id) => {
  const res = await api.post(`/complaints/${id}/support`);
  return unwrap(res);
};

export const toggleUpvote = toggleSupport;

export const getComplaintTimeline = async (id) => {
  const res = await api.get(`/complaints/${id}/timeline`);
  return unwrap(res);
};

export const getComplaintComments = async (id) => {
  const res = await api.get(`/complaints/${id}/comments`);
  return unwrap(res);
};

export const addComplaintComment = async (id, text) => {
  const res = await api.post(`/complaints/${id}/comments`, { text });
  return unwrap(res);
};

export const getCitizenDashboard = async () => {
  const res = await api.get("/complaints/my");
  const complaints = unwrap(res) || [];
  const getStatus = (complaint) => complaint?.assignedTask?.status || complaint?.status;

  return {
    myComplaints: complaints.length,
    activeComplaints: complaints.filter((complaint) =>
      ["pending", "accepted", "in-progress"].includes(getStatus(complaint))
    ).length,
    resolvedComplaints: complaints.filter((complaint) => getStatus(complaint) === "completed").length,
  };
};
