import api from "./axios";

/* =========================
   CREATE
========================= */

export const createComplaint = async (data) => {
  return api.post("/complaints", data);
};

/* =========================
   READ
========================= */

export const getAllComplaints = async (filters = {}) => {
  return api.get("/complaints", { params: filters });
};

export const getMyComplaints = async () => {
  return api.get("/complaints/my");
};

export const getComplaintById = async (id) => {
  return api.get(`/complaints/${id}`);
};

/* =========================
   UPDATE
========================= */

export const updateComplaint = async (id, data) => {
  return api.put(`/complaints/${id}`, data);
};

/* =========================
   DELETE
========================= */

export const deleteComplaint = async (id) => {
  return api.delete(`/complaints/${id}`);
};

/* =========================
   GEO SEARCH
========================= */

export const getNearbyComplaints = async (lat, lng, radiusKm = 5) => {
  return api.get("/complaints/nearby", {
    params: { lat, lng, radiusKm },
  });
};