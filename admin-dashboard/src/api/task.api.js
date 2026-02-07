import api from "./axios";

export const assignTask = (complaintId, workerId) => {
  return api.post("/tasks/assign", {
    complaintId,
    workerId,
  });
};
