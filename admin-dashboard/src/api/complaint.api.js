import api from "./axios";

export const getAllComplaints = () => {
  return api.get("/complaints");
};

export const getComplaintsByDepartment = (type) => {
  return api.get(`/admin/complaints/department/${type}`);
};
