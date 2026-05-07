import api, { API_BASE } from "./axios";

export const COMPLAINT_TYPES = {
  HOSTEL: "hostel",
  CAMPUS: "campus",
};

export const COMPLAINT_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  INCOMPLETED: "incompleted",
  CLOSED: "closed",
};

const unwrap = (res) => res.data?.data ?? res.data;

const toAssetUrl = (value) => {
  if (!value || typeof value !== "string") return value;
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_BASE}${value.startsWith("/") ? value : `/${value}`}`;
};

const toUiStatus = (status) => {
  if (["completed", "closed"].includes(status)) return "resolved";
  if (["assigned", "accepted", "in-progress"].includes(status)) return "in_progress";
  return status || "pending";
};

const normalizeComplaint = (complaint) => {
  if (!complaint) return complaint;
  const departmentName =
    complaint.departmentName ||
    complaint.departmentId?.name ||
    complaint.department?.name ||
    complaint.issueType ||
    "other";

  return {
    ...complaint,
    status: toUiStatus(complaint.status),
    issueType: complaint.issueType || departmentName,
    departmentName,
    upvotes:
      complaint.upvotes ??
      complaint.upvotesCount ??
      complaint.supportCount ??
      complaint.supporters?.length ??
      0,
    images: Array.isArray(complaint.images) ? complaint.images.map(toAssetUrl) : [],
  };
};

const normalizeList = (items) => (Array.isArray(items) ? items.map(normalizeComplaint) : []);

export const getCitizenDashboard = async () => {
  const res = await api.get("/complaints/my");
  const complaints = normalizeList(unwrap(res));

  return {
    myComplaints: complaints.length,
    activeComplaints: complaints.filter((item) => item.status === "in_progress").length,
    pendingComplaints: complaints.filter((item) =>
      ["new", "pending"].includes(item.status)
    ).length,
    resolvedComplaints: complaints.filter((item) =>
      ["completed", "closed"].includes(item.status)
    ).length,
  };
};

export const getAllComplaints = async (params = {}) => {
  const res = await api.get("/complaints", { params });
  return normalizeList(unwrap(res));
};

export const getMyComplaints = async () => {
  const res = await api.get("/complaints/my");
  return normalizeList(unwrap(res));
};

export const getComplaintById = async (id) => {
  const res = await api.get(`/complaints/${id}`);
  return normalizeComplaint(unwrap(res));
};

export const getNearbyComplaints = async ({ lat, lng, radiusKm = 5 } = {}) => {
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
    return getAllComplaints();
  }

  const res = await api.get("/complaints/nearby", { params: { lat, lng, radiusKm } });
  return normalizeList(unwrap(res));
};

export const createComplaint = async (payload) => {
  const isFormData = payload && typeof payload.append === "function";
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : undefined;
  const res = await api.post("/complaints", payload, config);
  return normalizeComplaint(unwrap(res));
};

export const toggleUpvote = async (complaintId) => {
  const res = await api.post(`/complaints/${complaintId}/support`);
  const data = unwrap(res);

  return {
    ...data,
    upvotes: data?.upvotes ?? data?.supporters?.length ?? 0,
  };
};

export const getComplaintComments = async (complaintId) => {
  const res = await api.get(`/complaints/${complaintId}/comments`);
  return unwrap(res);
};

export const addComplaintComment = async (complaintId, text) => {
  const res = await api.post(`/complaints/${complaintId}/comments`, { text });
  return unwrap(res);
};

export const getComplaintTimeline = async (complaintId) => {
  const res = await api.get(`/complaints/${complaintId}/timeline`);
  return unwrap(res);
};

export const deleteComplaint = async (id) => {
  const res = await api.delete(`/complaints/${id}`);
  return res.data;
};
